'use strict';
const Chance = require('chance');
const chance = new Chance()

const randomEmail = () => chance.email();
const randomUrl = () => chance.url();
const randomStr = (size = 11) => chance.hash({length: size})

module.exports = {randomStr, randomEmail, randomUrl};
