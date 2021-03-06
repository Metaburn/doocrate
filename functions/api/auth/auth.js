/**
 * Returns the logged in user
 */
exports.user = (req, res) => {
  res.send(JSON.stringify(req.user));
};

/**
 * Checks for the given user if it has permission for this object
 * @param req - GET - project - the user project
 * @returns returns user permission
 */
exports.project_permissions = async (req, res) => {
  console.log(req.query);
  console.log(req.user);

  const { firestore } = req.app.locals;
  const { project } = req.query;
  const { user } = req;

  // TODO - Sanitize project to protect against bad characters

  if (project === undefined) {
    return res
      .status(400)
      .send(JSON.stringify({ error: 'Project is invalid' }));
  }

  console.log({ project });
  const projectDocument = await firestore
    .collection('projects')
    .doc(project)
    .get();
  const projectData = projectDocument.data();

  console.log({ projectDocument });
  console.log({ projectData });

  // Public project are internet wide public - this is here till we implement an invites system
  if (projectData.isPublic === true) {
    const payload = {
      canAdd: true,
      canAssign: true,
      canComment: true,
      canView: true,
    };
    return res.send(JSON.stringify(payload));
  }

  const inviteList = await firestore
    .collection('projects')
    .doc(project)
    .collection('invitation_lists');

  const inviteListResponse = await inviteList
    .where('invites', 'array-contains', user.email)
    .get();

  const inviteListResultSize = inviteListResponse.size;

  // TODO - Right now there is only one write permissions enabled
  const haveAccess = inviteListResultSize > 0;
  const payload = {
    canAdd: haveAccess,
    canAssign: haveAccess,
    canComment: haveAccess,
    canView: haveAccess,
  };

  res.send(JSON.stringify(payload));
};
