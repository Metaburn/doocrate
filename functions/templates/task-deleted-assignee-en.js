exports.taskDeletedAssigneeEn = (args) => {
  const {fromName, taskTitle, link} = args;
  const template = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html>
    <head>
    </head>
    <body>
    <h1>We thought you should know you were removed from a task</h1>
    <br/>
    <h2>${fromName} deleted the task ${taskTitle}.</h2>
    <br/>
    <h3>That means you are no longer the task assignee</h3>
    <p>You can open the project by </p>
    <a href='${ link }'>Click here! &raquo;</a>
    <p>You can also reply to this email to contact ${fromName}</p>
    </body>
    </html>
  `;

    return template;
};
