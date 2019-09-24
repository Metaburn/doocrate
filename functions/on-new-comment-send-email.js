import {firebaseDb} from "../src/firebase";

const functions = require('firebase-functions');
import newCommentEn from './templates/new-comment-en';
import newCommentHe from './templates/new-comment-he';
const emailConfig = functions.config().email;
const shouldSendNotifications = emailConfig? encodeURIComponent(emailConfig.send_notifications) : false;
const fromEmail = emailConfig? decodeURIComponent(emailConfig.from) : null;
const emailApiKey = emailConfig? encodeURIComponent(emailConfig.apikey) : 'No env variable set';
const emailDomain = emailConfig? encodeURIComponent(emailConfig.domain) : 'No env variable set';

const mailgun = require('mailgun-js')({apiKey:emailApiKey, domain:emailDomain});

const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore();
firestore.settings({
  timestampsInSnapshots: true
});


/*
  Whenever a new comment is created - an email is sent
 */
exports.onNewCommentSendEmail = functions.firestore.document('/projects/{projectId}/comments/{commentId}').onWrite((change, context)=> {

  if(!shouldSendNotifications) {
    console.warn('Send notifications turned off');
    return false;
  }

  const projectId = context.params.projectId;
  console.log('From:' + fromEmail);
  const comment = change.after.data();

  // Check for deleted comment
  if(!comment || !comment.taskId) {
    return;
  }

  return firestore.collection('projects').doc(projectId).collection('tasks').doc(comment.taskId).get().then( taskSnapshot => {
    const task = taskSnapshot.data();
    if(!task || !task.creator || !task.creator.email) {
      console.log('No email found');
      return;
    }

    function getUserInfo(userId) {
      return firebaseDb.collection('users').doc(userId).get();
    }

    function getEmailParams(toEmail, language) {
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
        emailTemplate = newCommentHe(templateData);
      }else { //English
        mailOptions.subject = `New Comment - [${shortTitle}]`;
        emailTemplate = newCommentEn(templateData);
      }

      mailOptions.html = emailTemplate;
      return mailOptions;
    }

    // Get the user language and send the email
    const userPromises = [];
    const creatorEmail = task.creator.email;
    userPromises.push(getUserInfo(creatorEmail));
    if(task.assignee && task.assignee.email && task.assignee.email !== creatorEmail) {
      userPromises.push(getUserInfo(task.assignee.email));
    }

    // TODO replace with await
    return Promise.all(userPromises).then(usersData => {
      const mailPromises = [];
      console.log(usersData);
      const languageCreator = usersData[0].language || 'he'; //Defaults to hebrew;
      mailPromises.push(mailgun.messages().send(getEmailParams(usersData[0].email,languageCreator)));
      if(usersData.length > 1) {
        const languageAssignee = usersData[1].language || 'he'; //Defaults to hebrew;
        mailPromises.push(mailgun.messages().send(getEmailParams(usersData[1].email, languageAssignee)));
      }

      return Promise.all(promises).then(values => {
        console.log('Email sent successfully');
        return true;
      }).catch(error => {
        console.error('Error sending mail:', error);
        return error;
      });
    });
    }
  )});
