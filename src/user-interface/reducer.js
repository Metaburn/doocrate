import { Record } from 'immutable';
import {SET_MENU_OPEN} from './action-types';

export const UserInterfaceState = new Record({
  isMenuOpen: false,
});

export function userInterfaceReducer(state = new UserInterfaceState(), action) {
  switch (action.type) {

    case SET_MENU_OPEN:
      return state.merge({
        isMenuOpen: action.payload
      });

    default:
      return new UserInterfaceState();
  }
}
