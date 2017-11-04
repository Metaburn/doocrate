import { DISMISS_NOTIFICATION, SHOW_ERROR, SHOW_SUCCESS } from './action-types';


export function dismissNotification() {
  return {
    type: DISMISS_NOTIFICATION
  };
}

export function showError(message) {
  return {
    type: SHOW_ERROR,
    payload: message
  };
}

export function showSuccess(message) {
  return {
    type: SHOW_SUCCESS,
    payload: message
  };
}