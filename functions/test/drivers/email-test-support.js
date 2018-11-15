'use strict';
const {randomEmail, randomStr, randomUrl} = require('./random-test-utils');

const taskId = randomStr();
const creatorName = randomStr();
const creatorEmail = randomEmail();
const targetEmail = randomEmail();
const doocracteEmail = randomEmail();
const creatorPhotoUrl = randomUrl();
const shortTitle = randomStr();
const commentContent = randomStr();

module.exports = {taskId, creatorName, creatorEmail, targetEmail, doocracteEmail, creatorPhotoUrl, shortTitle, commentContent};
