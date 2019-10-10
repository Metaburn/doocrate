import { Record } from 'immutable';
import { INIT_AUTH, SIGN_IN_SUCCESS, SIGN_OUT_SUCCESS, UPDATE_PROFILE } from './action-types';


export const AuthState = new Record({
  authenticated: false,
  id: null,
  name: null,
  email: null,
  bio: null,
  updatedEmail: null, //The email that the user input as updated
  photoURL: null,
  phoneNumber: null,
  role: 'user',
  isEmailConfigured: false,
  canCreateTask: false,
  canAssignTask: false,
  didntBuy: false,
  shouldShowUpdateProfile: false,
  adminProjects: [],
  defaultProject: null,
  language: null
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
        bio: payload? payload.bio : null,
        updatedEmail: payload? payload.updatedEmail : null,
        photoURL: payload? payload.photoURL : null,
        phoneNumber: payload? payload.phoneNumber : null,
        role: payload? payload.role : null,
        isEmailConfigured: payload? payload.isEmailConfigured: null,
        canCreateTask: payload? payload.canCreateTask: null,
        canAssignTask: payload? payload.canAssignTask: null,
        didntBuy: payload? payload.didntBuy: null,
        adminProjects: payload? payload.adminProjects: [],
        defaultProject: payload? payload.defaultProject: null,
        language: payload? payload.language: null,
      });

    case SIGN_OUT_SUCCESS:
      return new AuthState();

    case UPDATE_PROFILE:
      return state.merge({
        shouldShowUpdateProfile: (!!payload)
  });

    default:
      return state;
  }
}
