import { SET_MENU_OPEN } from './action-types';

// Close or opens the side menu
export function setMenuOpen(isOpen) {
  return {
    type: SET_MENU_OPEN,
    payload: isOpen
  };
}
