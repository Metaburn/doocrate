const functions = require('firebase-functions');
const newCommentEn = require('../services/email/email-templates/new-comment-en');
const newCommentHe = require('../services/email/email-templates/new-comment-he');
const emailConfig = functions.config().email;
const fromEmail = emailConfig ? decodeURIComponent(emailConfig.from) : null;

const EmailService = require('../services/email/email.service');
const admin = require('firebase-admin');
try {
  admin.initializeApp();
} catch (e) {
  // continue - app was already initialized
}

const firestore = admin.firestore();

// TODO - Is this the place to init it? Should Email Service be a singleton?
const emailService = new EmailService();

/*
  Whenever a new comment is created - an email is sent
 */
exports.onNewCommentSendEmail = functions.firestore
  .document('/projects/{projectId}/comments/{commentId}')
  .onWrite(async (change, context) => {
    const projectId = context.params.projectId;
    console.log('From:' + fromEmail);
    const comment = change.after.data();

    // Check for deleted comment
    if (!comment || !comment.taskId) {
      return;
    }

    // Get the task
    const taskSnapshot = await firestore
      .collection('projects')
      .doc(projectId)
      .collection('tasks')
      .doc(comment.taskId)
      .get();
    const task = taskSnapshot.data();

    if (!task || !task.creator || !task.creator.email) {
      console.log('No email found');
      return;
    }

    function getUserInfo(userId) {
      return firestore
        .collection('users')
        .doc(userId)
        .get();
    }

    function getProjectInfo(projectId) {
      return firestore
        .collection('projects')
        .doc(projectId)
        .get();
    }

    function getEmailParams(domain, toEmail, language) {
      console.log(`To: ${toEmail}`);
      const mailOptions = {
        from: comment.creator.email,
        fromName: comment.creator.name,
        to: toEmail,
        'h:Reply-To': comment.creator.email,
      };

      const templateData = {
        fromName: comment.creator.name,
        fromEmail: comment.creator.email,
        fromPhotoUrl: comment.creator.photoURL,
        body: comment.body,
        link: `${domain}/${projectId}/task/${comment.taskId}`,
      };

      const shortTitle = task.title.substr(0, 20);
      if (language === 'he') {
        mailOptions.subject = `תגובה חדשה - [${shortTitle}]`;
        mailOptions.html = newCommentHe.newCommentHe(templateData);
      } else {
        //English
        mailOptions.subject = `New Comment - [${shortTitle}]`;
        mailOptions.html = newCommentEn.newCommentEn(templateData);
      }

      return mailOptions;
    }

    // Go over listeners - Get their languages and send emails in the right language
    const userPromises = [];
    task.listeners.forEach(listener =>
      userPromises.push(getUserInfo(listener)),
    );

    const project = await getProjectInfo(projectId);
    const projectData = project.data();

    let domain;
    // If project has domain - set the target of the email to that domain
    if (projectData.domainUrl && projectData.domainUrl !== '') {
      domain = projectData.domainUrl;
    } else {
      domain = emailConfig.full_domain;
    }

    const usersData = await Promise.all(userPromises);

    for (const currentUser of usersData) {
      const userData = currentUser.data();
      const languageRecipient = userData.language || 'he'; //Defaults to hebrew;
      emailService.sendMessage(
        getEmailParams(domain, userData.email, languageRecipient),
      );
    }

    try {
      await emailService.getAllMessagesPromise();
      console.log(`${usersData.length} Emails sent successfully`);
      return true;
    } catch (error) {
      console.error('Error sending mail:', error);
      return error;
    }
  });
