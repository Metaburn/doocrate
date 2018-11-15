'use strict';

const functions = require('firebase-functions');
const Firestore = require('@google-cloud/firestore');
const email = require('notifications/email');
const tasks = require('tasks/tasks');

// Limit the number of tasks by creator
exports.limitTasksPerCreatorFirestore = functions.firestore.document('/tasks/{taskId}').onCreate((snap, context) => {
  console.log("On create");
  const parentRef = snap.ref.parent;
  const task = snap.data();

  // If delete occur or this is an existing record or no creator
  if (tasks.taskIsDeletedOrMalformedTask(task))
    return;

  const creatorId = task.creator.id;

  return parentRef.where('creator.id',"==", creatorId).get()
                  .then(snapshot => {
    if(tasks.userTasksQuotaReached(snapshot)) {
      return snap.ref.delete();
    }
  });
});


//----------------SendEmail----------------

// TODO: Configure the `email.from`, `send_notifications`, `email.apikey`, `email.domain` Google Cloud environment variables.
// For example: firebase functions:config:set email.send_notifications="true"
const shouldSendNotifications = encodeURIComponent(functions.config().email.send_notifications);
const fromEmail = decodeURIComponent(functions.config().email.from);
const emailApiKey = encodeURIComponent(functions.config().email.apikey);
const emailDomain = encodeURIComponent(functions.config().email.domain);

console.log(`Should send notifications: ${shouldSendNotifications}`);
console.log(fromEmail);
console.log(emailApiKey);
console.log(emailDomain);
const mailgun = require('mailgun-js')({apiKey:emailApiKey, domain:emailDomain})

const firestore = new Firestore();

exports.sendEmail = functions.firestore.document('/comments/{commentId}')
                                       .onWrite(change => {
  if( !shouldSendNotifications ) {
    console.log('send notifications turned off');
    return;
  }

  const comment = change.after.data();

  // Check for deleted comment
  if(!comment || !comment.taskId) {
    return
  }

  return firestore.collection('tasks')
                  .doc(comment.taskId).get()
                  .then( taskSnapshot => {
    const task = taskSnapshot.data();
    if(!task || !task.creator || !task.creator.email) {
      console.log('No email found');
      return;
    }

    const creatorEmail = task.creator.email;
    const shortTitle = task.title.substr(0, 20);
    const promises = [];

    promises.push(mailgun.messages().send(email.renderEmailFrom(fromEmail, creatorEmail, comment, shortTitle)));
    if(task.assignee && task.assignee.email && task.assignee.email !== creatorEmail) {
      promises.push(mailgun.messages().send(email.renderEmailFrom(fromEmail, task.assignee.email, comment, shortTitle)));
    }

    return Promise.all(promises)
                  .then(() => console.log('email sent successfully') )
                  .catch(error => console.error('error sending mail:', error) );
    })});
