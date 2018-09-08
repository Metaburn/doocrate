import { Record } from 'immutable';
import { INIT_AUTH, SIGN_IN_SUCCESS, SIGN_OUT_SUCCESS, UPDATE_PROFILE } from './action-types';


export const AuthState = new Record({
  authenticated: false,
  id: null,
  name: null,
  email: null,
  updatedEmail: null, //The email that the user input as updated
  photoURL: null,
  phoneNumber: null,
  role: 'user',
  isEmailConfigured: false,
  canCreateTask: false,
  canAssignTask: false,
  shouldShowUpdateProfile: false
});


export function authReducer(state = new AuthState(), {payload, type}) {
  switch (type) {
    case INIT_AUTH:
    case SIGN_IN_SUCCESS:
      return state.merge({
        authenticated: !!payload,
        id: payload ? payload.uid : null,
        name: payload? payload.displayName : null,
        email: payload? payload.email : null,
        updatedEmail: payload? payload.updatedEmail : null,
        photoURL: payload? payload.photoURL : null,
        phoneNumber: payload? payload.phoneNumber : null,
        role: payload? payload.role : null,
        isEmailConfigured: payload? payload.isEmailConfigured: null,
        canCreateTask: payload? payload.canCreateTask: null,
        canAssignTask: payload? payload.canAssignTask: null,
      });

    case SIGN_OUT_SUCCESS:
      return new AuthState();

    case UPDATE_PROFILE:
      var shouldShow;
      if (payload) {
        shouldShow = true;
      }else {
        shouldShow = false;
      }

      return state.merge({
        shouldShowUpdateProfile: shouldShow
  });

    default:
      return state;
  }
}
