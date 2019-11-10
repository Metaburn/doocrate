const functions = require("firebase-functions");
const Firestore = require("@google-cloud/firestore");

const admin = require("firebase-admin");
try {
  admin.initializeApp();
} catch (e) {
  // continue - app was already initialized
}

const firestore = admin.firestore();

function generateRandomSuffix() {
  return Math.floor(Math.random() * (1 + 9999 - 1000)) + 1000;
}

/*
  Whenever a new project is created - the user who created it becomes an admin for that project
 */
exports.onNewProjectMakeAdmin = functions.firestore
  .document("/projects/{projectId}")
  .onCreate(async (change, context) => {
    const project = change.data();
    const projectId = context.params.projectId;
    console.log(project);

    // Check for deleted project
    if (!project || !project.name || !project.creator) {
      return;
    }

    // Create an url and check if already exists
    const projectUrl = project.name.replace(/([^a-z0-9א-ת ]+)/gi, "-");

    let result = await firestore
      .collection("projects")
      .where("url", "==", projectUrl)
      .get();

    if (!result.empty) {
      projectUrl = `${projectUrl}-${generateRandomSuffix()}`;
    }

    // Set admins->User Id->Projects->User Id
    let docRef = firestore.collection("admins").doc(project.creator.id);
    return docRef
      .set({
        name: project.creator.name,
        updated: new Date()
      })
      .then(() => {
        let projectsRef = firestore
          .collection("admins")
          .doc(project.creator.id)
          .collection("projects")
          .doc(projectId);
        return projectsRef.set({
          projectUrl,
          created: new Date()
        });
      });
  });
