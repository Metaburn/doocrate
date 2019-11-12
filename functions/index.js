'use strict';

// Max number of tasks per creator
const functions = require('firebase-functions');
exports.onNewProjectMakeAdminFunctions = require('./firestore_hooks/on-new-project-make-admin');
exports.onNewCommentSendEmail = require('./firestore_hooks/on-new-comment-send-email');
exports.onEditTaskSendEmail = require('./firestore_hooks/on-edit-task-send-email');
exports.api = require('./doocrateApi').app;

const MAX_TASK_PER_CREATOR = 80;
// Limit the number of tasks by creator
exports.limitTasksPerCreatorFirestore = functions.firestore.document('/tasks/{taskId}').onCreate((snap, context) => {
  console.log("On create");
  const parentRef = snap.ref.parent;
  const task = snap.data();

  // If delete occur or this is an existing record or no creator
  if (!task || !task.creator || !task.creator.id)
    return;

  const creatorId = task.creator.id;

  return parentRef.where('creator.id',"==", creatorId).get().then(snapshot => {

    if(snapshot.size >= MAX_TASK_PER_CREATOR) {
      return snap.ref.delete();
    }
  });
});
