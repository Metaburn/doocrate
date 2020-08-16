import { List, Record, Set } from 'immutable';
import { SIGN_OUT_SUCCESS } from 'src/auth/action-types';
import { firebaseCollectionToList } from 'src/firebase/firebase-list';

import {
  CREATE_TASK_SUCCESS,
  REMOVE_TASK_SUCCESS,
  LOAD_TASKS_SUCCESS,
  UPDATE_TASK_SUCCESS,
  SET_FILTERED_TASKS,
  SET_SELECTED_FILTERS,
} from './action-types';

export const TasksState = new Record({
  deleted: null,
  previous: null,
  list: new List(),
  filteredList: new List(),
  selectedFilters: {}, //Selected filters such as query
  labelsPool: new Set(), // Those holds all the labels in the tasks
  auth: null,
  created: null,
  searchQuery: '',
});

function extractLabels(collection) {
  const result = [];
  for (const doc of collection) {
    const labels = doc.data().label;
    if (labels) {
      result.push(...Object.keys(labels));
    }
  }
  return result;
}

export function tasksReducer(state = new TasksState(), { payload, type }) {
  switch (type) {
    // This is fired when the user creates a task or when a remote user creates a task
    case CREATE_TASK_SUCCESS:
      return state.merge({
        deleted: null,
        created: payload,
        list: state.list.push(payload),
        filteredList: state.list.push(payload),
        // Adds all the labels from the task into the labels pool
        labelsPool: state.labelsPool.union(Object.keys(payload.label || {})),
      });

    case REMOVE_TASK_SUCCESS:
      return state.merge({
        deleted: payload,
        created: null,
        previous: state.list,
        list: state.list.filter(task => task.id !== payload.id),
        filteredList: state.filteredList.filter(task => task.id !== payload.id),
      });

    case LOAD_TASKS_SUCCESS:
      const defaultTasks = new List(
        firebaseCollectionToList(payload.reverse()),
      );
      return state
        .set('list', defaultTasks)
        .set('labelsPool', new Set(extractLabels(payload)))
        .set('filteredList', defaultTasks);

    case SET_FILTERED_TASKS:
      return state.set('filteredList', new List(payload));

    case SET_SELECTED_FILTERS:
      return state.set('selectedFilters', payload);

    case UPDATE_TASK_SUCCESS:
      return state.merge({
        deleted: null,
        created: null,
        list: state.list.map(task => {
          return task.id === payload.id ? payload : task;
        }),
        filteredList: state.filteredList.map(task => {
          return task.id === payload.id ? payload : task;
        }),
      });

    case SIGN_OUT_SUCCESS:
      return new TasksState();

    default:
      return state;
  }
}
