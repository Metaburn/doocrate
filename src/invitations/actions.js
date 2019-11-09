import { invitationsList } from './invitations-list';
import { INVITATION_STATUS } from './invitation';
import firebase from 'firebase/app';

import {
  ADD_EMAILS,
  ADD_EMAIL_ERROR, ADD_EMAIL_SUCCESS
} from './action-types';
import {CREATE_COMMENT_SUCCESS} from "../comments";
import {firebaseDb} from "../firebase";


export function addEditorUsersEmails(emails, cb) {

  if (!isUserAdmin(user)){
    return dispatch => { (dispatch(addEmailError('User is not an admin'))) }
  }

  emails.forEach(email => {

    if (!verifyEmailIsNotAssignedToEditorUser(email)){
      return;
    }

    const invitation = {
      id: null,
      invitationListId: null,
      email: email,
      created: new Date,
      status: INVITATION_STATUS.PENDING,
      userId: null
    };

    return dispatch => {
      invitationsList.push(invitation)
        .then(cb)
        .catch(error => dispatch(addEmailError(error)));
    };
  })
}

function getIsAdmin(authUser) {
  if(!authUser) {
    return new Promise( (resolve, reject) => {
      resolve('guest');
    })
  }
  return firebaseDb.collection('admins').doc(authUser.uid).get();
}

function verifyEmailIsNotAssignedToEditorUser(email){
  return true;
}

export function addEmailSuccess(invitation) {
  return {
    type: ADD_EMAIL_SUCCESS,
    payload: invitation
  };
}

export function addEmailError(error) {
  console.warn(`Failed to save email: ${error}`);
  return {
    type: ADD_EMAIL_ERROR,
    payload: error
  };
}
