import { createSelector } from 'reselect';


export function getMenuIsOpenState(state) {
  return state.userInterface.isMenuOpen;
}

export const getMenuIsOpen = createSelector(
  getMenuIsOpenState,
  (menuIsOpen) => {
    return menuIsOpen;
  }
);
