exports.user = (req, res) => {
  res.send(`Hello ${req.user.name}`);
};

/**
 * Checks for the given user if it has permission for this object
 * @param req - GET - project - the user project
 * @returns returns user permission
 */
exports.project_permissions = async (req, res) => {
  console.log(req.params);
  console.log(req.user);

  const {firestore} = res.app.get("firestore");
  const {project} = req.params;
  // TODO - Sanitize project to protect against bad characters

  const inviteList = await firestore
    .collection("projects")
    .doc(project)
    .collection("invitation_lists")
    .doc("main");

  const inviteListResponse = await inviteList
    .where("invites", "array-contains", req.user.token.email).get();

  console.log(inviteListResponse);
  const inviteListResult = inviteListResponse.data();
  console.log(inviteListResult);

  // TODO - Right now there is only one write permissions enabled
  const haveAccess = inviteListResult.length > 0;
  const payload = {
    canAdd: haveAccess,
    canAssign: haveAccess,
    canComment: haveAccess,
    canView: haveAccess
  };

  res.send(JSON.stringify(payload));
};
