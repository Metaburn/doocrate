const functions = require('firebase-functions');

const emailService = new require('./emailService')();

const removedFromTaskEn = require('./templates/removed-from-task-en');
const removedFromTaskHe = require('./templates/removed-from-task-he');
const taskDeletedAssgineeEn = require('./templates/task-deleted-assignee-en');
const taskDeletedAssgineeHe = require('./templates/task-deleted-assignee-he');

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
exports.onEditTaskSendEmail = functions.firestore.document('/projects/{projectId}/tasks/{taskId}').onWrite(
  async (change, context) => {

    const { projectId } = context.params;
    const taskBefore = change.before.data();

    if (!taskBefore || !taskBefore.id) {
      console.log('Created for the first time');
      // Created for the first time - no email is needed
      return;
    }

    if (taskBefore.creator.id === taskBefore.assignee.id) {
      // Creator is same as Assignee - no need to email him his own actions
      console.log('Creator is same as assignee');
      return;
    }

    const oldAssignee = taskBefore.assignee;

    const task = change.after.data();
    // Handle deleted task
    if (!task || !task.id) {
      emailService.sendMessage(getMessageToSend(taskBefore, taskDeletedAssgineeEn, taskDeletedAssgineeHe));
      return;
    }
    // If before it was with assignee and now there is NO assignee
    // Then assignee was just removed from a task
    else if (oldAssignee && !task.assignee) {
      emailService.sendMessage(getMessageToSend(taskBefore, removedFromTaskEn, removedFromTaskHe));
    }

    try {
      await emailService.getAllMessagesPromise();
      console.log('Emails sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending mail:', error);
      return error;
    }


    function getMessageToSend(toEmail, taskBefore, templateEn, templateHe) {
      const creator = taskBefore.creator;
      const language = taskBefore.assignee.language || 'he'; //Defaults to hebrew;

      const mailOptions = {};

      const templateData = {
        fromName: creator.name,
        link: `https://doocrate.com/${projectId}/task/${taskBefore.id}` //TODO: handle burnerot domain
      };

      const shortTitle = taskBefore.title.substr(0, 20);
      if (language === 'he') {
        mailOptions.subject = `הוסרת ממשימה - [${shortTitle}]`;
        mailOptions.html = templateHe(templateData);

      } else { //English
        mailOptions.subject = `You were removed from - [${shortTitle}]`;
        mailOptions.html = templateEn(templateData);
      }

      mailOptions.fromName = creator.name;
      mailOptions.from = creator.email;
      mailOptions.to = toEmail;

      emailService.sendMessage(mailOptions);
    }
  });
