import firebase from 'firebase/app';

import { toast } from 'react-toastify';

import { firebaseAuth } from 'src/firebase';
import {
  INIT_AUTH,
  SIGN_IN_ERROR,
  SIGN_IN_SUCCESS,
  SIGN_OUT_SUCCESS,
  MAGIC_LINK_SUCCESS,
  UPDATE_PROFILE
} from './action-types';
import * as browserUtils from "../utils/browser-utils";


function authenticate(provider) {
  firebaseAuth.useDeviceLanguage();
  return dispatch => {
    firebaseAuth.signInWithRedirect(provider)
      .then(result => { dispatch(signInSuccess(result, dispatch)) })
      .catch(error => dispatch(signInError(error)));
  };
}

export function signInMagic() {
  return dispatch => {
    // Confirm the link is a sign-in with email link.
    if (firebaseAuth.isSignInWithEmailLink(window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      let emailFromUrl = browserUtils.getUrlSearchParams(window.location.search)['email'];
      email = email || emailFromUrl;
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please provide your email for confirmation');
      }
      // The client SDK will parse the code from the link for you.
      firebaseAuth.signInWithEmailLink(email, window.location.href)
        .then( result => {
          window.location.reload();
          dispatch(signInSuccess(result, dispatch));
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
        })
        .catch( error => {
          dispatch(signInError(error));
        });
    }
  }
}

// Upon clicking on the email this is where the user is navigating to
export function signInWithEmailPassword(email) {
  firebaseAuth.useDeviceLanguage();
  const project = browserUtils.getCookie('project');
  const options = {
    'url': `${window.location.origin}/magic-link?email=${email}&project=${project}`,
    handleCodeInApp: true,
  };

  return dispatch => {
    window.localStorage.setItem('emailForSignIn', email);
    firebaseAuth.sendSignInLinkToEmail(email, options)
      .then(result => { dispatch(magicLinkSuccess(result, dispatch)) })
      .catch(error => dispatch(signInError(error)));
  };
}


// Since we are having some issues with auth - that might some users
function authenticatePopup(provider) {
  firebaseAuth.useDeviceLanguage();
  return dispatch => {
    firebaseAuth.signInWithPopup(provider)
      .then(result => { dispatch(signInSuccess(result, dispatch)) })
      .catch(error => dispatch(signInError(error)));
  };
}



export function initAuth(user) {
  return {
    type: INIT_AUTH,
    payload: user
  };
}

export function signInError(error) {
  const errorMessage = error && error.message? error.message : error;
  console.log(errorMessage);
  toast.error(errorMessage);
  return {
    type: SIGN_IN_ERROR,
    payload: error
  };
}

export function magicLinkSuccess(result) {
  return {
    type: MAGIC_LINK_SUCCESS,
    payload: result
  }
}

export function signInSuccess(result) {
  return {
    type: SIGN_IN_SUCCESS,
    payload: result.user
  };
}


export function signInWithFacebook(isIssues) {
  if(!isIssues) {
    return authenticate(new firebase.auth.FacebookAuthProvider());
  }else {
    return authenticatePopup(new firebase.auth.FacebookAuthProvider());
  }
}


export function signInWithGoogle(isIssues) {
  if(!isIssues) {
    return authenticate(new firebase.auth.GoogleAuthProvider());
  }else {
    return authenticatePopup(new firebase.auth.GoogleAuthProvider());
  }
}

export function signOut() {
  return dispatch => {
    firebaseAuth.signOut()
      .then(() => dispatch(signOutSuccess()));
  };
}

export function isShowUpdateProfile(isShow) {
  return dispatch => {
    dispatch({
      type: UPDATE_PROFILE,
      payload: isShow
    })
  };
}


export function signOutSuccess() {
  return {
    type: SIGN_OUT_SUCCESS
  };
}
