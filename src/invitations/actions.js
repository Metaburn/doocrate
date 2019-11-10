import { invitationListFirebaseList } from "./invitations-list";
import { invitationFirebaseList } from "./invitation";
import { INVITATION_STATUS } from "./invitation";
import firebase from "firebase/app";

import {
  CREATE_INVITATION_LIST_SUCCESS,
  CREATE_INVITATION_LIST_ERROR,
  CREATE_INVITATION_SUCCESS,
  CREATE_INVITATION_ERROR,
  LOAD_INVITATION_LIST_SUCCESS
} from "./action-types";

//#region Invitation List
export function createInvitationList(invitationList) {
  return dispatch => {
    invitationListFirebaseList
      .push(invitationList)
      .then(createdInvitationList => {
        return dispatch(createInvitationListSuccess(createdInvitationList));
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
    payload: invitationList
  };
}

export function createInvitationListError(error) {
  return {
    type: CREATE_INVITATION_LIST_ERROR,
    payload: error
  };
}

export function loadInvitationListForProject(projectId) {
  return dispatch => {
    invitationListFirebaseList.query = ["projectId", "==", projectId];
    invitationListFirebaseList.subscribe(dispatch);
  };
}

export function loadInvitationListSuccess(invitationList) {
  return {
    type: LOAD_INVITATION_LIST_SUCCESS,
    payload: invitationList
  };
}
//#endregion

//#region Invitation
export function createInvitation(invitation) {
  return dispatch => {
    invitationFirebaseList
      .push(invitation)
      .then(createdInvitation => {
        return dispatch(createInvitationSuccess(createdInvitation));
      })
      .catch(error => {
        //TODO: Log error to sentry
        const errorMessage = error && error.message ? error.message : error;
        return dispatch(createInvitationListError(errorMessage));
      });
  };
}

export function createInvitations(invitations) {
  return dispatch => {
    invitationFirebaseList
      .pushBatch(invitations)
      .then(createdInvitations => {
        return dispatch(createMultipleInvitationSuccess(createdInvitations));
      })
      .catch(error => {
        //TODO: Log error to sentry
        const errorMessage = error && error.message ? error.message : error;
        return dispatch(createInvitationListError(errorMessage));
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
  return {
    type: CREATE_INVITATION_ERROR,
    payload: error
  };
}

export function loadInvitatiosForInvitationList(invitationListId) {
  return dispatch => {
    invitationFirebaseList.query = ["invitationListId", "==", invitationListId];
    invitationFirebaseList.subscribe(dispatch);
  };
}

export function loadInvitationsSuccess(invitations) {
  return {
    type: LOAD_INVITATION_LIST_SUCCESS,
    payload: invitations
  };
}
//#endregion
