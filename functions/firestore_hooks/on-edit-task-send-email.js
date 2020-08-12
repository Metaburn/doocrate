// This is commented out cause it's been firing those emails on random save events
// There is a bug that needs to be addressed
/*const functions = require('firebase-functions');

const EmailService = require('../services/email/email.service');

const removedFromTaskEn = require('../services/email/email-templates/removed-from-task-en');
const removedFromTaskHe = require('../services/email/email-templates/removed-from-task-he');

const admin = require('firebase-admin');
try {
  admin.initializeApp();
}catch (e) {
  // continue - app was already initialized
}

const firestore = admin.firestore();

/*
  Whenever a task is unassigned / removed - an email is sent to the assignee
    TODO There is a race condition where a task was unassigned then deleted. 2 events would be fired.
  //TODO  Both of them current data would be unassigned and deleted leading to a 2 task was deleted messages
 */
/*exports.onEditTaskSendEmail = functions.firestore.document('/projects/{projectId}/tasks/{taskId}').onWrite(
  async (change, context) => {

    const emailService = new EmailService();
    const { projectId, taskId } = context.params;
    const taskBefore = change.before.data();
    console.log('Before');
    console.log(taskBefore);

    if (!taskBefore) {
      console.log('Created for the first time');
      return;
    }

    const beforeAssignee = taskBefore.assignee;

    if (!beforeAssignee) {
      console.log('There was no assignee before this change');
      return;
    }

    if (taskBefore.creator.id === beforeAssignee.id) {
      // Creator is same as Assignee - no need to email him his own actions
      console.log('Creator is same as assignee');
      return;
    }

    const task = change.after.data();
    // Handle deleted task where there was assignee
    if (!task || !task.id) {
      emailService.sendMessage(
        getMessageToSend(taskBefore,
          removedFromTaskEn.removedFromTaskEn,
          removedFromTaskHe.removedFromTaskHe));
    }
    // If before it was with assignee and now there is NO assignee
    // Then assignee was just removed from a task
      // We do the seperation to support in the future distinguish between delete and simple unassigned
    else if (!task.assignee) {
      emailService.sendMessage(
        getMessageToSend(taskBefore,
          removedFromTaskEn.removedFromTaskEn,
          removedFromTaskHe.removedFromTaskHe));
    }

    try {
      // Wait for all messages to be sent
      await emailService.getAllMessagesPromise();
      console.log('Emails sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending mail:', error);
      return error;
    }

    function getUserInfo(userId) {
      return firestore.collection('users').doc(userId).get();
    }

    async function getMessageToSend(taskBefore, templateEn, templateHe) {
      const creator = taskBefore.creator;
      const assigneeBefore = taskBefore.assignee;

      const userInfo = await getUserInfo(assigneeBefore.id);
      const assigneeBeforeInfo = userInfo.data();

      const language = assigneeBeforeInfo.language || 'he'; //Defaults to hebrew;

      const mailOptions = {};

      const templateData = {
        fromName: creator.name,
        taskTitle: taskBefore.title,
        link: `https://doocrate.com/${projectId}/task/${taskId}` //TODO: handle burnerot domain
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
      mailOptions.to = assigneeBeforeInfo.email;

      emailService.sendMessage(mailOptions);
    }
  });
*/
