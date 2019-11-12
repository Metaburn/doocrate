const functions = require('firebase-functions');
const Firestore = require('@google-cloud/firestore');

const admin = require('firebase-admin');
try {
  admin.initializeApp();
}catch (e) {
  // continue - app was already initialized
}

const firestore = admin.firestore();

/*
  Whenever a new project is created - the user who created it becomes an admin for that project
  Also we create the invitation list with it
 */
exports.onNewProjectMakeAdmin = functions.firestore.document('/projects/{projectId}').onCreate(
  async (change, context)=> {

    const project = change.data();
    const projectId = context.params.projectId;
    console.log(project);

    // Check for deleted project
    if (!project || !project.name || !project.creator) {
      return;
    }

    // Set admins->User Id->Projects->User Id
    let docRef = firestore.collection('admins').doc(project.creator.id);
    try {
      await docRef.set({
        name: project.creator.name,
        updated: new Date()
      });

      let projectsRef = firestore
        .collection('admins')
        .doc(project.creator.id)
        .collection('projects')
        .doc(projectId);

      await projectsRef.set({
        created: new Date(),
      });

      return createInvitationListForProject(projectId, project.creator);
    } catch (error) {
      console.error('Error Setting admin and  invitation list for project:', error);
      return error;
    }
  });

const createInvitationListForProject = async(projectId, creator) => {
  const invitationList = {
    created: new Date(),
    updated: new Date(),
    name: "main",
    creatorId: creator.id,
    creator: creator.name,
    url: null,
    canAdd: true,
    canAssign: true,
    canComment: true,
    canView: true,
    invites: [creator.email]
  };
  // We call the default invitation "main" - this is coupled to the firebase rules
  return firestore
    .collection("projects")
    .doc(projectId)
    .collection("invitation_lists")
    .set("main", invitationList);
}
