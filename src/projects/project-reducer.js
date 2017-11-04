import { List, Record } from 'immutable';

import {
  CREATE_PROJECT_SUCCESS,
  REMOVE_PROJECT_SUCCESS,
  LOAD_PROJECTS_SUCCESS,
  UPDATE_PROJECT_SUCCESS,
} from './action-types';


export const ProjectState = new Record({
  list: new List(),
});


export function projectsReducer(state = new ProjectState(), {payload, type}) {
  switch (type) {
    case CREATE_PROJECT_SUCCESS:
      return state.merge({
        list: state.list.unshift(payload)
      });

    case REMOVE_PROJECT_SUCCESS:
      return state.merge({
        list: state.list.filter(project => project.id !== payload.id)
      });
    
    case LOAD_PROJECTS_SUCCESS:
      return state.set('list', new List(payload.reverse()));

    case UPDATE_PROJECT_SUCCESS:
      return state.merge({
        list: state.list.map(project => {
          return project.id === payload.id ? payload : project;
        })
      });

    default:
      return state;
  }
}
