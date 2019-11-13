import { invitationListFirebaseList } from "./invitations-list";
import {
  invitationFirebaseList,
  InvitationStatus
} from "./invitation";

import {
  CREATE_INVITATION_LIST_SUCCESS,
  CREATE_INVITATION_LIST_ERROR,
  UPDATE_INVITATION_LIST_ERROR,
  CREATE_INVITATION_SUCCESS,
  CREATE_INVITATION_ERROR,
  UPDATE_INVITATION_LIST_SUCCESS,
  LOAD_INVITATIONS_SUCCESS,
  LOAD_INVITATION_LIST_SUCCESS,
  UPDATE_INVITATION_SUCCESS,
  UPDATE_INVITATION_ERROR
} from "./action-types";
import {firebaseDb} from "src/firebase";
import firebase from "firebase/app";

//#region Invitation List

export function createInvitationList(
  projectId,
  invitationList,
  invitationListId
) {
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

export function loadInvitationListSuccess(invitationList) {
  return {
    type: LOAD_INVITATION_LIST_SUCCESS,
    payload: invitationList[0] //TODO For now we only load the first one
  };
}

/** Update Invitation List
 * Currently we store the invites in the members field of that list
 * */
export function updateInvitationListMembers(projectId, invites) {

  return dispatch => {
    firebaseDb
      .collection("projects")
      .doc(projectId)
      .collection("invitation_lists")
      .doc("main")
      .set({"invites": invites}, { merge: true })
      .then(updatedInvitation => {
        dispatch(updateInvitationListSuccess(updatedInvitation));
      })
      .catch(error => {
        dispatch(updateInvitationListError(error));
      });
  };
}

export function removeInvitation(invitation) {
  // TODO: remove it from array
}

export function updateInvitationListSuccess(invitationList) {
  return {
    type: UPDATE_INVITATION_LIST_SUCCESS,
    payload: invitationList
  };
}

export function updateInvitationListError(error) {
  return {
    type: UPDATE_INVITATION_LIST_ERROR,
    payload: error
  };
}


//#endregion

//#region Invitation

/** Creating
 * */
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

/**
 * We need to create 2 objects - one is the invitation the admin manage
 * And the other is the defacto one that firebase rules used to manage access
 */
export function createInvitations(projectId, invitations) {
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
      .update(invitation.id, invitation)
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

/** We use the invites to see if a certain user has access to a project */
export function getUserAccessToProject(projectUrl) {
  return dispatch => {
    // TODO
    // make a call to our server to fetch the access a given user has to the server
    // then set it on the auth object in some way
  };
}
