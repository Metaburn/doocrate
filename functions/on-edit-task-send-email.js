const functions = require('firebase-functions');
const newCommentEn = require('./templates/new-comment-en');
const newCommentHe = require('./templates/new-comment-he');
const emailConfig = functions.config().email;
const shouldSendNotifications = emailConfig? encodeURIComponent(emailConfig.send_notifications) : false;
const fromEmail = emailConfig? decodeURIComponent(emailConfig.from) : null;
const emailApiKey = emailConfig? encodeURIComponent(emailConfig.apikey) : 'No env variable set';
const emailDomain = emailConfig? encodeURIComponent(emailConfig.domain) : 'No env variable set';

const mailgun = require('mailgun-js')({apiKey:emailApiKey, domain:emailDomain});

const admin = require('firebase-admin');
try {
  admin.initializeApp();
}catch (e) {
  // continue - app was already initialized
}

const firestore = admin.firestore();

/*
  Whenever a task is unassigned - an email is sent to the assignee on removal
 */
exports.onNewCommentSendEmail = functions.firestore.document('/projects/{projectId}/tasks/{taskId}').onWrite(
  async (change, context) => {

    if (!shouldSendNotifications) {
      console.warn('Send notifications turned off');
      return false;
    }

    const projectId = context.params.projectId;
    console.log('From:' + fromEmail);
    const task = change.after.data();

    // Check for deleted task - TODO - maybe relevant
    if (!task || !task.id) {
      return;
    }

    if (!task.assignee || !task.assignee.email) {
      console.log('No email found');
      return;
    }

    const taskBefore = change.before.data();


    // TODO if creator is not task.assignee then return


        function getUserInfo(userId) {
      return firestore.collection('users').doc(userId).get();
    }

    function getEmailParams(toEmail, language) {
      console.log(`To: ${toEmail}`);
      const mailOptions = {
        from: task.creator.name + ' ' + fromEmail, // For example Gal Bracha <support@doocrate.com>
        to: toEmail,
        'h:Reply-To': task.creator.email
      };
      let emailTemplate;

      /*const templateData = {
        fromName: task.creator.name,
        fromEmail: task.creator.email,
        fromPhotoUrl: task.creator.photoURL,
        link: `https://doocrate.com/${projectId}/task/${task.id}`
      };*/

      const shortTitle = task.title.substr(0, 20);
      const taskLink = task.id;
      if (language === 'he') {
        mailOptions.subject = `הוסרת ממשימה - [${shortTitle}]`;
        emailTemplate = <body><p>הסירו אותך מהמשימה - {'/projects/{projectId}/tasks/{taskId}'}</p></body>
      } else { //English
        mailOptions.subject = `You were removed from - [${shortTitle}]`;
        emailTemplate = <body><p>You were removed from {'/projects/{projectId}/tasks/{taskId}'}</p></body>
      }

      mailOptions.html = emailTemplate;
      return mailOptions;
    }

    //If before it was with assignee and now there is NO assignee
    // Then send the taskBefore.assignee an email saying
    // "You were removed from this task" with a link to the actual task
    if (taskBefore.assignee && !task.assignee) {
      const languageAssignee = taskBefore.assignee.language || 'he'; //Defaults to hebrew;
      mailPromises.push(mailgun.messages().send(getEmailParams(taskBefore.assignee.email, languageAssignee)));
    }

    // Get the users languages to send emails in the right language
    // const userPromises = [];
    // userPromises.push(getUserInfo(task.creator.id));
    // if (task.assignee && task.assignee.id && task.assignee.id !== task.creator.id) {
    //   userPromises.push(getUserInfo(task.assignee.id));
    // }

    // const usersData = await Promise.all(userPromises);
    // const creator = usersData[0].data();
    // const languageCreator = creator.language || 'he'; //Defaults to hebrew;
    // const mailPromises = [];

    // Send the emails
    // mailPromises.push(mailgun.messages().send(getEmailParams(task.assignee.email, languageCreator)));
    // if (usersData.length > 1) {
    //   const assignee = usersData[1].data();
    //   const languageAssignee = assignee.language || 'he'; //Defaults to hebrew;
    //   mailPromises.push(mailgun.messages().send(getEmailParams(assignee.email, languageAssignee)));
    // }

    try {
      await Promise.all(mailPromises);
      console.log('Emails sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending mail:', error);
      return error;
    }
  });
