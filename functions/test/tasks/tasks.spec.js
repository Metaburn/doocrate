'use strict';
const {expect} = require('chai');
const {userTasksQuotaReached, taskIsDeletedOrMalformedTask} = require('../../tasks/tasks');

describe('doocracte tasks util', () => {

  it('limit number of tasks to 80', () => {
    expect(userTasksQuotaReached({size: 80 - 1})).to.be.false;
    expect(userTasksQuotaReached({size: 80})).to.be.true;
  })

  it('return false to malformed snapshots', () => {
    expect(userTasksQuotaReached('')).to.be.false;
    expect(userTasksQuotaReached({})).to.be.false;
    expect(userTasksQuotaReached()).to.be.false;
  })

  it('validate if task is deleted by checking is task is undefined', () => {
    expect(taskIsDeletedOrMalformedTask()).to.be.true;
  })

  it('validate if task is malformed by checking is task has creator id', () => {
    expect(taskIsDeletedOrMalformedTask({creator: {id: 'some-id'}})).to.be.false;
    expect(taskIsDeletedOrMalformedTask({creator: {}})).to.be.true;
  })
});
