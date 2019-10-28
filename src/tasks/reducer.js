import { List, Record, Set } from 'immutable';
import { SIGN_OUT_SUCCESS } from 'src/auth/action-types';
import { firebaseCollectionToList } from 'src/firebase/firebase-list';

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
  labelsPool: new Set(),
  auth: null,
  created: null
});


function extractLabels(collection) {
  const result = [];
  for (const doc of collection) {
    const labels = doc.data().label;
    if(labels) {
      result.push(...Object.keys(labels));
    }
  }
  return result;
}

export function tasksReducer(state = new TasksState(), {payload, type}) {
  switch (type) {
    case CREATE_TASK_SUCCESS:
      return state.merge({
        deleted: null,
        created: payload,
        list: state.list.unshift(payload),
        // Adds all the labels from the task into the labels pool
        labelsPool: state.labelsPool.union(Object.keys(payload.label || {})),
      });

    case REMOVE_TASK_SUCCESS:
      return state.merge({
        deleted: payload,
        created: null,
        previous: state.list,
        list: state.list.filter(task => task.data().id !== payload.id)
      });

    case LOAD_TASKS_SUCCESS:
      return state.set('list', new List(firebaseCollectionToList(payload.reverse())))
        .set('labelsPool',new Set(extractLabels((payload))));

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
