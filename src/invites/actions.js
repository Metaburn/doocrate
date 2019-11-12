import { invitationListFirebaseList } from "./invitations-list";
import { invitationFirebaseList } from "./invitation";

import {
  CREATE_INVITATION_LIST_SUCCESS,
  CREATE_INVITATION_LIST_ERROR,
  CREATE_INVITATION_SUCCESS,
  CREATE_INVITATION_ERROR,
  LOAD_INVITATIONS_SUCCESS,
  LOAD_INVITATION_LIST_SUCCESS,
  UPDATE_INVITATION_SUCCESS,
  UPDATE_INVITATION_ERROR
} from "./action-types";
import {taskList} from "../tasks/task-list";

//#region Invitation List

export function createInvitationListForProject(projectId, auth) {
  const invitationList =  {
    created: new Date(),
    updated: new Date(),
    name: "Invitations",
    creatorId: auth.id,
    creator: auth.name,
    url: null,
    canAdd: true,
    canAssign: true,
    canComment: true,
    canView: true
  };
  //we use main so we can call it from other places
  return createInvitationList(projectId, invitationList, "main");
}

export function createInvitationList(projectId, invitationList, invitationListId) {
  return dispatch => {
    invitationListFirebaseList.rootPath = "projects";
    invitationListFirebaseList.rootDocId = projectId;
    invitationListFirebaseList.path = "invitation_lists";
    invitationListFirebaseList.subscribe(dispatch);
    invitationListFirebaseList
      .set(invitationListId, invitationList)
      .then(() => {
        return dispatch(createInvitationListSuccess(invitationList));
      })
      .catch(error => {
        //TODO: Log error to sentry
        const errorMessage = error && error.message ? error.message : error;
        return dispatch(createInvitationListError(errorMessage));
      });
  };
}

export function createInvitationListSuccess(invitationList) {
  return {
    type: CREATE_INVITATION_LIST_SUCCESS,
    payload: invitationList[0] //TODO For now we only load the first one
  };
}

export function createInvitationListError(error) {
  console.warn(`createInvitationListError error: ${error}`);
  return {
    type: CREATE_INVITATION_LIST_ERROR,
    payload: error
  };
}

export function loadInvitationListByProject(projectId) {
  return dispatch => {
    invitationListFirebaseList.rootPath = "projects";
    invitationListFirebaseList.rootDocId = projectId;
    invitationListFirebaseList.path = "invitation_lists";
    invitationListFirebaseList.subscribe(dispatch);
  };
}

export function loadInvitationsByProject(projectId) {
  return dispatch => {
    invitationFirebaseList.rootPath = "projects";
    invitationFirebaseList.rootDocId = projectId;
    invitationFirebaseList.path = "invitations";
    invitationFirebaseList.subscribe(dispatch);
  };
}

/** Loading */
/*export function loadInvitationListById(invitationListId) {
  return dispatch => {
    invitationFirebaseList.rootPath = "projects";
    invitationFirebaseList.rootDocId = projectId;
    invitationFirebaseList.path = "invitation_lists";
    invitationFirebaseList.query = ["invitationListId", "==", invitationListId];
    invitationFirebaseList.subscribe(dispatch);
  };
}*/

export function loadInvitationListSuccess(invitationList) {
  return {
    type: LOAD_INVITATION_LIST_SUCCESS,
    payload: invitationList[0] //TODO For now we only load the first one
  };
}
//#endregion

//#region Invitation

/** Creating */
export function createInvitation(invitation) {
  return dispatch => {
    return invitationFirebaseList
      .push(invitation)
      .then(() => {
        return dispatch(createInvitationSuccess(invitation));
      })
      .catch(error => {
        //TODO: Log error to sentry
        const errorMessage = error && error.message ? error.message : error;
        return dispatch(createInvitationError(errorMessage));
      });
  };
}

export function createInvitations(invitations) {
  return dispatch => {
    return invitationFirebaseList
      .pushBatch(invitations)
      .then(() => {
        return dispatch(createMultipleInvitationSuccess(invitations));
      })
      .catch(error => {
        //TODO: Log error to sentry
        const errorMessage = error && error.message ? error.message : error;
        return dispatch(createInvitationError(errorMessage));
      });
  };
}

export function createInvitationSuccess(invitation) {
  return {
    type: CREATE_INVITATION_SUCCESS,
    payload: invitation
  };
}

export function createMultipleInvitationSuccess(invitations) {
  return {
    type: CREATE_INVITATION_SUCCESS,
    payload: invitations
  };
}

export function createInvitationError(error) {
  console.warn(`createInvitationError error: ${error}`);
  return {
    type: CREATE_INVITATION_ERROR,
    payload: error
  };
}

export function loadInvitationsSuccess(invitations) {
  return {
    type: LOAD_INVITATIONS_SUCCESS,
    payload: invitations //TODO: we only support one invitation list for now
  };
}

/** Updating */
export function updateInvitation(invitation) {
  return dispatch => {
    invitationFirebaseList
      .set(invitation.id, invitation)
      .then(updatedInvitation => {
        dispatch(updateInvitationSuccess(updatedInvitation));
      })
      .catch(error => {
        dispatch(updateInvitationError(error));
      });
  };
}

export function updateInvitationSuccess(invitation) {
  return {
    type: UPDATE_INVITATION_SUCCESS,
    payload: invitation
  };
}

export function updateInvitationError(error) {
  console.warn(`updateInvitationError error: ${error}`);
  return {
    type: UPDATE_INVITATION_ERROR,
    payload: error
  };
}
//#endregion
