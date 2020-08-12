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
  const projects = await getAllProjects();
  console.log(`Found ${projects.length} projects`);
  for (project of projects) {
    // TODO Get project admins and guides
    // Get all new tasks (Created in the last 24 hours)
    // TODO For each user
    //   > TODO - check if that user has a checkbox set to true
    //   > TODO - get the user language
    console.log(`Emailing admins of ${project.name}`);
  }

  console.log('Sent daily emails');
};

const getAllProjects = async () => {
  const snapshot = await firestore.collection('projects').get();
  let result = [];
  snapshot.docs.forEach(doc => {
    const project = doc.data();
    console.log({ project });
    result.push(project);
  });
  return result;
};

module.exports = sendDailyEmail;
