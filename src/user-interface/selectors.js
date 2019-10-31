import { createSelector } from 'reselect';


export const getMenuIsOpenState = ({ userInterface }) => userInterface.isMenuOpen;
export const getTourState = ({ userInterface }) => userInterface.tour;

export const getMenuIsOpen = createSelector(getMenuIsOpenState, (menuIsOpen) => menuIsOpen);
export const getTour = createSelector(getTourState, (tour) => tour);
