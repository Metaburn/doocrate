const functions = require("firebase-functions");
const Firestore = require("@google-cloud/firestore");

const admin = require("firebase-admin");
try {
  admin.initializeApp();
} catch (e) {
  // continue - app was already initialized
}

const firestore = admin.firestore();

/*
  Whenever a new project is created - the user who created it becomes an admin for that project
 */
exports.onNewInviteCheckUser = functions.firestore
  .document("/projects/{projectId}/invitations/{invitationId}")
  .onCreate(async (change, context) => {
    const invitation = change.data();
    const projectId = context.params.projectId;
    const invitationId = context.params.invitationId;

    console.log(invitation);

    // Check for deleted project
    if (!invitation || !invitation.email || !invitation.status) {
      return;
    }

    let usersRef = await firestore
      .collection("users")
      .where("email", "==", invitation.email)
      .get();

    if (usersRef.size > 0) {
      const userId = usersRef[0].id;

      return firestore
        .collection(`/projects/${projectId}/invitations/${invitationId}`)
        .set({ userId });
    }
  });
