import { List, Record } from 'immutable';
import { SIGN_OUT_SUCCESS } from 'src/auth/action-types';

import {
  CREATE_TASK_SUCCESS,
  REMOVE_TASK_SUCCESS,
  LOAD_TASKS_SUCCESS,
  UPDATE_TASK_SUCCESS,
} from './action-types';


export const TasksState = new Record({
  deleted: null,
  previous: null,
  list: new List(),
  auth: null,
  created: null
});


export function tasksReducer(state = new TasksState(), {payload, type}) {
  switch (type) {
    case CREATE_TASK_SUCCESS:
      return state.merge({
        deleted: null,
        created: payload,
        list: state.list.unshift(payload)
      });

    case REMOVE_TASK_SUCCESS:
      return state.merge({
        deleted: payload,
        created: null,
        previous: state.list,
        list: state.list.filter(task => task.id !== payload.id)
      });

    case LOAD_TASKS_SUCCESS:
      return state.set('list', new List(payload.reverse()));

    case UPDATE_TASK_SUCCESS:
      return state.merge({
        deleted: null,
        created: null,
        list: state.list.map(task => {
          return task.id === payload.id ? payload : task;
        })
      });

    case SIGN_OUT_SUCCESS:
      return new TasksState();

    default:
      return state;
  }
}
