import { createSelector } from 'reselect';


export const getMenuIsOpenState = ({ userInterface }) => userInterface.isMenuOpen;

export const getMenuIsOpen = createSelector(getMenuIsOpenState, (menuIsOpen) => menuIsOpen);
