exports.removedFromTaskHe = (args) => {
  const {fromName, taskTitle, link} = args;
  const template = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html>
    <head>
        <style>
    body, h1, h2, h3, p, div {  
      direction: rtl; 
     }
      
    </style>
    </head>
    <body>
    <div>
      <h1>חשוב שתדע שהוסרת ממשימה</h1>
      <br/>
      <h2>
      אתה או 
        ${fromName}
         הסירו אותך מאחריות על המשימה 
        '${taskTitle}'
       </h2>
      <br/>
      <h3>זה אומר שאתה לא אחראי יותר על המשימה</h3>
      <p>אם המשימה עדיין קיימת - תוכל למצוא אותה על ידי
        <a href='${ link }'>לחיצה כאן! &raquo;</a>
      </p>	
      <br/>
      <p>תוכל גם להשיב למייל זה בשביל לדבר עם</p
      <br/>
      ${fromName}
     </div>
    </body>
    </html>
`;

  return template;
};
