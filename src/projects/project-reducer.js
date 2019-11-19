import { List, Record } from 'immutable';
import { showError } from 'src/notification/actions';

import {
  CREATE_PROJECT_SUCCESS,
  REMOVE_PROJECT_SUCCESS,
  LOAD_PROJECTS_SUCCESS,
  UPDATE_PROJECT_SUCCESS,
  NEW_PROJECT_CREATED,
  CREATE_PROJECT_ERROR,
  SET_USER_PERMISSIONS,
  SET_USER_PERMISSIONS_ERROR,
} from './action-types';
import { SELECT_PROJECT } from './action-types';
import { firebaseCollectionToList } from 'src/firebase/firebase-list';

export const ProjectState = new Record({
  list: new List(),
  selectedProject: null,
  selectedProjectUserPermissions: {},
});

export function projectsReducer(state = new ProjectState(), { payload, type }) {
  switch (type) {
    // When creating a new project we set the selected project
    case NEW_PROJECT_CREATED:
      return state.set('selectedProject', payload || null);

    case CREATE_PROJECT_SUCCESS:
      return state.merge({
        list: state.list.unshift(payload),
      });

    case REMOVE_PROJECT_SUCCESS:
      return state.merge({
        list: state.list.filter(project => project.id !== payload.id),
      });

    case LOAD_PROJECTS_SUCCESS:
      return state.set(
        'list',
        new List(firebaseCollectionToList(payload.reverse()))
      );

    case UPDATE_PROJECT_SUCCESS:
      return state.merge({
        list: state.list.map(project => {
          return project.url === payload.url ? payload : project;
        }),
      });

    case SELECT_PROJECT:
      return state.set('selectedProject', payload || null);

    case CREATE_PROJECT_ERROR:
      showError(payload);
      return state;

    case SET_USER_PERMISSIONS:
      return state.set('selectedProjectUserPermissions', payload);

    case SET_USER_PERMISSIONS_ERROR:
      state.set('selectedProjectUserPermissions', {});
      showError(payload.statusText);
      return state;

    default:
      return state;
  }
}
