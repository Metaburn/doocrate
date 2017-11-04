import { createSelector } from 'reselect';


export function getProjects(state) {
  return state.projects;
}

export function getProjectList(state) {
  return getProjects(state).list;
}

export const getVisibleProjects = createSelector(
  getProjectList,
  (projects) => {
    return projects;
  }
);
