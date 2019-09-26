exports.newCommentHe = (args) => {
  const {fromName, fromEmail, fromPhotoUrl, body, link} = args;

  const template = `<div style="direction:rtl;"><h2>תגובה חדשה</h2>
        <span>
        מאת:
        ${fromName} ${fromEmail}
        </span>
        <div><img src='${fromPhotoUrl}' style='display:block; border-radius:70px;width:140px;height:140px;'/></div><br/>
        
        <button style='background:#eb1478;cursor: pointer;color: white;padding:0.7em;font-size:1em;-webkit-border-radius: 3px;-moz-border-radius: 3px;border-radius: 3px;margin:20px 0'>
          <a style='text-decoration: none;color: white' href='${link}'>
          לחץ כאן למעבר למשימה
          </a>
        </button>
        <h3>תוכן: ${body}</h3> <br/>
        <br>אם ברצונך להסיר את עצמך מנוטיפקציות כאלו. אנא שלח אימייל ל-support@doocrate.com
        <br>        דואוקרט
        </div>
      `;

  return template;
}
