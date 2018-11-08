//----------------SendEmail----------------

const functions = require('firebase-functions');
// TODO: Configure the `email.from`, `send_notifications`, `email.apikey`, `email.domain` Google Cloud environment variables.
// For example: firebase functions:config:set email.send_notifications="true"
// For example: firebase functions:config:set email.apiKey=KEY
// For example: firebase functions:config:set email.domain=DOMAIN
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const shouldSendNotifications = encodeURIComponent(firebaseConfig.email.send_notifications);
const fromEmail = decodeURIComponent(firebaseConfig.email.from);
const emailApiKey = encodeURIComponent(firebaseConfig.email.apikey);
const emailDomain = encodeURIComponent(firebaseConfig.email.domain);

const mailgun = require('mailgun-js')({apiKey:emailApiKey, domain:emailDomain})

const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore();
/*
  Whenever a new project is created - the user who created it becomes an admin for that project
 */
exports.onNewProjectMakeAdmin = functions.firestore.document('/projects/{projectId}/comments/{commentId}').onWrite((change, context)=> {

  if(!shouldSendNotifications) {
    console.log('send notifications turned off');
    return;
  }

  const projectId = context.params.projectId;

  console.log('from:' + fromEmail);

  const comment = change.after.data();

  // Check for deleted comment
  if(!comment || !comment.taskId) {
    return
  }

  return firestore.collection('projects').doc(projectId).collection('tasks').doc(comment.taskId).get().then( taskSnapshot => {
      const task = taskSnapshot.data();
      if(!task || !task.creator || !task.creator.email) {
        console.log('No email found');
        return;
      }

      function getEmailParams(toEmail) {
        const mailOptions = {
          from: comment.creator.name + ' ' + fromEmail, // For example Gal Bracha <support@doocrate.com>
          to: toEmail,
          'h:Reply-To': comment.creator.email
        };


        const emailTemplate = `<div style="direction:rtl;"><h2>הערה חדשה</h2>
        <span>
        מאת: 
        ${comment.creator.name} ${comment.creator.email}
        </span>
        <div><img src='${comment.creator.photoURL}' style='display:block; border-radius:70px;width:140px;height:140px;'/></div><br/>
        
        <button style='background:#eb1478;cursor: pointer;color: white;padding:0.7em;font-size:0.8em;-webkit-border-radius: 3px;-moz-border-radius: 3px;border-radius: 3px;margin:20px'>
          <a style='text-decoration: none;color: white' href='https://doocrate.com/${projectId}/task/${comment.taskId}'>
          לחץ כאן למעבר למשימה
          </a>
        </button>
        <h3>תוכן: ${comment.body}</h3> <br/>
        <br>אם ברצונך להסיר את עצמך מנוטיפקציות כאלו. אנא שלח אימייל ל-support@doocrate.com
        <br>        דואוקרט
        </div>
      `;

        const shortTitle = task.title.substr(0, 20);
        mailOptions.subject = `הערה חדשה - [${shortTitle}]`;
        mailOptions.html = emailTemplate;
        return mailOptions;
      }

      const creatorEmail = task.creator.email;
      let promises = [];

      promises.push(mailgun.messages().send(getEmailParams(creatorEmail)));
      if(task.assignee && task.assignee.email && task.assignee.email !== creatorEmail) {
        promises.push(mailgun.messages().send(getEmailParams(task.assignee.email)));
      }

      return Promise.all(promises).then(values => {
        console.log('email sent successfully');
      }).catch(error => {
        console.error('error sending mail:', error);
      });
    }
  )});
