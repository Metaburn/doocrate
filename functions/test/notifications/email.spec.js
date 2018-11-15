'use strict';
const {
  taskId,
  commentContent,
  creatorEmail,
  creatorName, creatorPhotoUrl,
  doocracteEmail,
  shortTitle,
  targetEmail
} = require('../drivers/email-test-support');

const {expect} = require('chai');
const {renderEmailFrom} = require('../../notifications/email');

describe('doocracte user notifications', () => {
  it('render user email in hebrew', () => {
    const renderedEmail = renderEmailFrom(doocracteEmail, targetEmail, {taskId, creator: {name: creatorName, email: creatorEmail, photoURL: creatorPhotoUrl}, body: commentContent}, shortTitle);

    expect(renderedEmail).to.have.property('from', `${creatorName} ${doocracteEmail}`);
    expect(renderedEmail).to.have.property('to', targetEmail);
    expect(renderedEmail).to.have.property('h:Reply-To', creatorEmail);
    expect(renderedEmail).to.have.property('subject').that.have.string(shortTitle);
    expect(renderedEmail).to.have.property('html').that.have.string(commentContent);
    expect(renderedEmail).to.have.property('html').that.have.string(creatorName);
    expect(renderedEmail).to.have.property('html').that.have.string(creatorEmail);
    expect(renderedEmail).to.have.property('html').that.have.string(creatorPhotoUrl);
  })
});
