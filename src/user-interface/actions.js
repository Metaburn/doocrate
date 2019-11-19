import { SET_MENU_OPEN, SET_TOUR } from './action-types';

// Close or opens the side menu
export function setMenuOpen(isOpen) {
  return {
    type: SET_MENU_OPEN,
    payload: isOpen,
  };
}

export function setTour(isShow, step) {
  return {
    type: SET_TOUR,
    payload: { isShow, step },
  };
}
