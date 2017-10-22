'use strict';

const functions = require('firebase-functions');
const Firestore = require('@google-cloud/firestore');

// Max number of tasks per creator
const MAX_TASK_PER_CREATOR = 500;

// Limit the number of tasks by creator
exports.limitTasksPerCreatorFirestore = functions.firestore.document('/tasks/{taskId}').onCreate(event => {
  console.log("On create");
  const parentRef = event.data.ref.parent;
  const task = event.data.data();

  // If delete occur or this is an existing record or no creator
  if ( event.data.previous ||
      !event.data || !task ||
      !task.creator || !task.creator.id)
    return;

  const creatorId = task.creator.id;
  
  return parentRef.where('creator.id',"==", creatorId).get().then(snapshot => {
    
    if(snapshot.size >= MAX_TASK_PER_CREATOR) {
      return event.data.ref.delete();
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

exports.sendEmail = functions.firestore.document('/comments/{commentId}').onWrite(event => {
  
  if(!shouldSendNotifications) {
    console.log('send notifications turned off');
    return;
  }

  const comment = event.data.data();

  // Check for deleted comment
  if(!comment || !comment.taskId) {
    return
  }

  return firestore.collection('tasks').doc(comment.taskId).get().then( taskSnapshot => {
    const task = taskSnapshot.data();
    if(!task || !task.creator || !task.creator.email) {
      console.log('No email found');
      return;
    }

    function getEmailParams(toEmail) {
      const mailOptions = {
        from: fromEmail,
        to: toEmail
      };

      const emailTemplate = `<div style="direction:rtl;"><h1>הערה חדשה</h1>
        מאת: ${comment.creator.name}(${comment.creator.email})
        <img src='${comment.creator.photoURL}' style='border-radius:70px;width:140px;height:140px;'/><br/> 
        תוכן: ${comment.body} <br/>
        <a href='https://doocrate.midburnerot.com/task/${comment.taskId}'>לחץ כאן למעבר למשימה</a>
        <br>אם ברצונך להסיר את עצמך מנוטיפקציות כאלו. אנא שלח אימייל ל-burnerot@gmail.com
        <br>
        דואוקרט
        </div>
      `;

      const shortTitle = task.title.substr(0, 15);
      mailOptions.subject = `הערה חדשה - [${shortTitle}]`;
      mailOptions.html = emailTemplate;
      return mailOptions;
    }

    const creatorEmail = task.creator.email;    
    let promises = [];

    promises.push(mailgun.messages().send(getEmailParams(creatorEmail)));
    if(task.assignee && task.assignee.email && task.assignee.email != creatorEmail) {
      promises.push(mailgun.messages().send(getEmailParams(task.assignee.email)));
    }

    return Promise.all(promises).then(values => {
      console.log('email sent successfully');
    }).catch(error => {
      console.error('error sending mail:', error);  
    });
  }
)});