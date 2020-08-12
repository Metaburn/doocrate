const functions = require('firebase-functions');

// This would run every day at 9:00 AM IDT (Israel standard time)
const timeToRun = '0 9 * * *'; // 'every 5 minutes';
const { sendDailyEmail } = require('../api/email/sendDailyEmail');

exports.scheduledFunction = functions.pubsub
  .schedule(timeToRun)
  .timeZone('Asia/Jerusalem')
  .onRun(context => {
    return sendDailyEmail();
  });
