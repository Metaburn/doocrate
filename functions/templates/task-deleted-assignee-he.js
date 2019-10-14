exports.taskDeletedAssigneeHe = (args) => {
  const {fromName, link} = args;
  const template = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html>
  <head>
  </head>
  <body>
  <h1>חשבנו שכדאי שתדע</h1>
  <h2>${fromName} deleted a task you were assignee to.</h2>
  <h3>That means you are no longer the task assignee</h3>
  <p>You can open the project by clicking here</p>
  <a href='${ link }'>Click here! &raquo;</a>	to open project</p>
  You can also reply to this email to contact ${fromName}
  </body>
  </html>
`;

  return template;
};
