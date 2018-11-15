'use strict';

function renderEmailFrom(fromEmail, toEmail, comment, shortTitle) {
  const taskId = comment.taskId;
  const creatorName = comment.creator.name;
  const creatorEmail = comment.creator.email;
  const creatorPhotoUrl = comment.creator.photoURL;
  const commentContent = comment.body;

  const emailTemplate = `<div style="direction:rtl;"><h2>הערה חדשה</h2>
        <span>
        מאת: 
        ${creatorName} ${creatorEmail}
        </span>
        <div><img src='${creatorPhotoUrl}' style='display:block; border-radius:70px;width:140px;height:140px;'/></div><br/>
        
        <button style='background:#eb1478;cursor: pointer;color: white;padding:0.7em;font-size:0.8em;-webkit-border-radius: 3px;-moz-border-radius: 3px;border-radius: 3px;margin:20px'>
          <a style='text-decoration: none;color: white' href='https://doocrate.burnerot.com/task/${taskId}'>
          לחץ כאן למעבר למשימה
          </a>
        </button>
        <h3>תוכן: ${commentContent}</h3> <br/>
        <br>אם ברצונך להסיר את עצמך מנוטיפקציות כאלו. אנא שלח אימייל ל-burnerot@gmail.com
        <br>        דואוקרט
        </div>
      `;


  return {
    from: `${creatorName} ${fromEmail}`, // For example Gal Bracha <support@burnerot.com>
    to: toEmail,
    'h:Reply-To': creatorEmail,
    subject: `הערה חדשה - [${shortTitle}]`,
    html: emailTemplate,
  }
}

module.exports = {renderEmailFrom};
