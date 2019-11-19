import { Record } from 'immutable';
import { SET_MENU_OPEN, SET_TOUR } from './action-types';

export const UserInterfaceState = new Record({
  isMenuOpen: false,
  // Set the walkthrough. aka tour
  tour: {
    isShow: false,
    step: 0,
  },
});

export function userInterfaceReducer(state = new UserInterfaceState(), action) {
  switch (action.type) {
    case SET_MENU_OPEN:
      return state.merge({
        isMenuOpen: action.payload,
      });

    case SET_TOUR:
      return state.merge({
        tour: action.payload,
      });

    default:
      return state;
  }
}
