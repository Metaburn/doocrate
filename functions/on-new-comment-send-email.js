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
  Whenever a new comment is created - an email is sent
 */
exports.onNewCommentSendEmail = functions.firestore.document('/projects/{projectId}/comments/{commentId}').onWrite(
  async (change, context) => {

    if (!shouldSendNotifications) {
      console.warn('Send notifications turned off');
      return false;
    }

    const projectId = context.params.projectId;
    console.log('From:' + fromEmail);
    const comment = change.after.data();

    // Check for deleted comment
    if (!comment || !comment.taskId) {
      return;
    }

    const taskSnapshot = await firestore.collection('projects').doc(projectId).collection('tasks').doc(comment.taskId).get();
    const task = taskSnapshot.data();
    if (!task || !task.creator || !task.creator.email) {
      console.log('No email found');
      return;
    }

    function getUserInfo(userId) {
      return firestore.collection('users').doc(userId).get();
    }

    function getEmailParams(toEmail, language) {
      console.log(`To: ${toEmail}`);
      const mailOptions = {
        from: comment.creator.name + ' ' + fromEmail, // For example Gal Bracha <support@doocrate.com>
        to: toEmail,
        'h:Reply-To': comment.creator.email
      };
      let emailTemplate;

      const templateData = {
        fromName: comment.creator.name,
        fromEmail: comment.creator.email,
        fromPhotoUrl: comment.creator.photoURL,
        body: comment.body,
        link: `https://doocrate.com/${projectId}/task/${comment.taskId}}`
      };

      const shortTitle = task.title.substr(0, 20);
      if (language === 'he') {
        mailOptions.subject = `תגובה חדשה - [${shortTitle}]`;
        emailTemplate = newCommentHe.newCommentHe(templateData);
      } else { //English
        mailOptions.subject = `New Comment - [${shortTitle}]`;
        emailTemplate = newCommentEn.newCommentEn(templateData);
      }

      mailOptions.html = emailTemplate;
      return mailOptions;
    }

    // Get the users languages to send emails in the right language
    const userPromises = [];
    const creatorEmail = task.creator.email;
    userPromises.push(getUserInfo(task.creator.id));
    if (task.assignee && task.assignee.id && task.assignee.id !== task.creator.id) {
      userPromises.push(getUserInfo(task.assignee.id));
    }

    const usersData = await Promise.all(userPromises);
    const creator = usersData[0].data();
    const languageCreator = creator.language || 'he'; //Defaults to hebrew;
    const mailPromises = [];

    // Send the emails
    mailPromises.push(mailgun.messages().send(getEmailParams(creator.email, languageCreator)));
    if (usersData.length > 1) {
      const assignee = usersData[1].data();
      const languageAssignee = assignee.language || 'he'; //Defaults to hebrew;
      mailPromises.push(mailgun.messages().send(getEmailParams(assignee.email, languageAssignee)));
    }

    try {
      await Promise.all(mailPromises);
      console.log('Emails sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending mail:', error);
      return error;
    }
  });
