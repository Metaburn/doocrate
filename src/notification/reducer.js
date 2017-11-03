import { Record } from 'immutable';
import { REMOVE_TASK_SUCCESS } from 'src/tasks';
import { SIGN_IN_ERROR } from 'src/auth';
import { DISMISS_NOTIFICATION, SHOW_ERROR } from './action-types';


export const NotificationState = new Record({
  actionLabel: '',
  display: false,
  message: '',
  type: ''
});


export function notificationReducer(state = new NotificationState(), action) {
  switch (action.type) {
    case REMOVE_TASK_SUCCESS:
      return state.merge({
        display: true,
        type: 'success',
        message: 'המשימה נמחקה'
      });

    case SIGN_IN_ERROR:
    case SHOW_ERROR:
      return state.merge({
        display: true,
        type: 'error',
        message: action.payload
      });
    
    case DISMISS_NOTIFICATION:
      return new NotificationState();

    default:
      return new NotificationState();
  }
}
