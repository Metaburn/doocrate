import { List, Record, Set } from 'immutable';
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
  labelsPool: new Set(),
  auth: null,
  created: null
});

/*
 Mapping from a firebase collection to a simple array
 We are adding the id and a function that allow to perform object.get
 */
function firebaseCollectionToList(collection) {
  return collection.map(task => {
    return Object.assign(task.data(),{get: (object)=>task[object], id: task.id});
  });
}


function extractLabels(collection) {
  const result = [];
  for (const doc of collection) {
    result.push(...Object.keys(doc.data().label));
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
        labelsPool: state.labelsPool.union(Object.keys(payload.label)),
      });

    case REMOVE_TASK_SUCCESS:
      return state.merge({
        deleted: payload,
        created: null,
        previous: state.list,
        list: state.list.filter(task => task.id !== payload.id)
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
