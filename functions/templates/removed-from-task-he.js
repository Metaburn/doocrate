exports.removedFromTaskHe = (args) => {
  const {fromName, taskTitle, link} = args;
  const template = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html>
    <head>
    <style>
    body {
      direction: rtl;
      }
    </style>
    </head>
    <body>
    <h1>חשוב שתדע שהוסרת ממשימה</h1>
    <br/>
    <h2>
      ${fromName} הסיר אותך מאחריות על המשימה ${taskTitle}
     </h2>
    <br/>
    <h2>המשימה: ${taskTitle}</h2>
    <h3>זה אומר שאתה לא אחראי יותר על המשימה</h3>
    <p>אם המשימה עדיין קיימת - תוכל למצוא אותה על ידי</p>
    <a href='${ link }'>לחיצה כאן! &raquo;</a>	</p>
    תוכל גם להשיב למייל זה בשביל לדבר עם<br/>
    ${fromName}
    </body>
    </html>
`;

  return template;
};
