const functions = require('firebase-functions');
const firestore = require('./index').firestore;

/*
  Whenever a new project is created - the user who created it becomes an admin for that project
 */
exports.onNewProjectMakeAdmin = functions.firestore.document('/projects/{projectId}').onCreate((change, context)=> {
  const project = change.after.data();
  console.log(project);

  // Check for deleted project
  if(!project || !project.name || !project.creator) {
    return;
  }

  return firestore.collection('admins').doc(project.creator.id).set({
    name: project.creator.name,
    projectId: project.id,
    created: new Date()
  });


});
