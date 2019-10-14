exports.removedFromTaskEn = (args) => {
  const {fromName, link} = args;
  const template = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html>
  <head>
  </head>
  <body>
  <h1>We thought you should know</h1>
  <h2>${fromName} removed you from a task.</h2>
  <h3>That means you are no longer the task assignee</h3>
  <p>If the task still exists - this is where you'll find it</p>
  <a href='${ link }'>Click here! &raquo;</a>	to open it</p>
  You can also reply to this email to contact ${fromName}
  </body>
  </html>
`;

  return template;
};
