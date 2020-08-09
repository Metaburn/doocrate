import { createSelector } from 'reselect';

export function getSelectedProject(state) {
  return state.projects.selectedProject;
}

//=====================================
//  MEMOIZED SELECTORS
//-------------------------------------

export const getProject = createSelector(
  getSelectedProject,
  selectedProject => {
    return selectedProject;
  },
);
