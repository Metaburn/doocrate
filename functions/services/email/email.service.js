const functions = require('firebase-functions');

/*
 An email service wrapper to allow queuing message together
 Email parameters are set through firebase configuration of `email`
 */
const EmailService = function() {
  const emailConfig = functions.config().email;
  this.OS_FROM_EMAIL = emailConfig
    ? decodeURIComponent(emailConfig.from)
    : null; // usually support@doocrate.com
  const apiKey = emailConfig
    ? encodeURIComponent(emailConfig.apikey)
    : 'No env variable set';
  const domain = emailConfig
    ? encodeURIComponent(emailConfig.domain)
    : 'No env variable set';
  this.promises = [];
  this.mailgun = require('mailgun-js')({ apiKey: apiKey, domain: domain });
};

EmailService.prototype.sendMessage = function(emailOptions) {
  const params = this._getMailParameters(emailOptions);
  console.log('Email parameters');
  console.log(params);
  this.promises.push(this.mailgun.messages().send(params));
};

// We used that to query if all messages sent successfully
EmailService.prototype.getAllMessagesPromise = function() {
  return Promise.all(this.promises);
};

EmailService.prototype._getMailParameters = function(emailOptions) {
  const { from, fromName, to, subject, html } = emailOptions;

  return {
    from: fromName + ' ' + this.OS_FROM_EMAIL, // First Last Name <support@doocrate.com>
    to: to,
    'h:Reply-To': from,
    subject: subject,
    html: html,
  };
};

module.exports = EmailService;
