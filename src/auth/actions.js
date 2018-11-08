import firebase from 'firebase/app';

import { toast } from 'react-toastify';

import { firebaseAuth } from 'src/firebase';
import {
  INIT_AUTH,
  SIGN_IN_ERROR,
  SIGN_IN_SUCCESS,
  SIGN_OUT_SUCCESS,
  UPDATE_PROFILE
} from './action-types';


function authenticate(provider) {
  firebaseAuth.useDeviceLanguage();
  return dispatch => {
    firebaseAuth.signInWithRedirect(provider)
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
  const errorMessage = error && error.message? error.message : error
  toast.error(errorMessage)
  return {
    type: SIGN_IN_ERROR,
    payload: error
  };
}


export function signInSuccess(result) {
  return {
    type: SIGN_IN_SUCCESS,
    payload: result.user
  };
}


export function signInWithFacebook() {
  return authenticate(new firebase.auth.FacebookAuthProvider());
}


export function signInWithGoogle() {
  return authenticate(new firebase.auth.GoogleAuthProvider());
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
