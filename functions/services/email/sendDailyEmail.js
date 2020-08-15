const EmailService = require('./email.service');
const emailService = new EmailService();
const admin = require('firebase-admin');
try {
  admin.initializeApp();
} catch (e) {
  // continue - app was already initialized
}
const firestore = admin.firestore();

const sendDailyEmail = async () => {
  console.log('Sending daily emails...');
  const admins = await getAdminsAndProjects('admins');
  console.log(`Found ${admins.length} admins to send email to`);
  for (admin of admins) {
    // Get all new tasks (Created in the last 24 hours)
    console.log(`Emailing admins of ${project.name}`);
  }

  console.log('Sent daily emails');
};

const getAdminsAndProjects = async () => {
  const snapshot = await firestore.collection('admins').get();
  let result = [];
  for (let i = 0; i < snapshot.docs.length; i++) {
    const doc = snapshot.docs[i];
    const userId = doc.id;
    const user = await (
      await firestore
        .collection('users')
        .doc(userId)
        .get()
    ).data();
    const adminProjects = await doc._ref.collection('projects').get();
    const adminProjectIds = adminProjects.docs.map(projectDoc => projectDoc.id);
    if (user.subscribedToEmailUpdates) {
      console.log(`About to send ${user.email} email updates`);
      result.push({
        userid: userId,
        email: user.email,
        language: user.language,
        projectIds: adminProjectIds,
      });
    }
  }
  return result;
};

module.exports = sendDailyEmail;
