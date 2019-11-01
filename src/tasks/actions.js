import { taskList } from './task-list';
import firebase from 'firebase/app';

import {
  CREATE_TASK_ERROR,
  CREATE_TASK_SUCCESS,
  REMOVE_TASK_ERROR,
  REMOVE_TASK_SUCCESS,
  FILTER_TASKS,
  LOAD_TASKS_SUCCESS,
  UNDELETE_TASK_ERROR,
  UNLOAD_TASKS_SUCCESS,
  UPDATE_TASK_ERROR,
  UPDATE_TASK_SUCCESS,
  SELECT_TASK,
  SET_FILTERED_TASKS,
  SET_SELECTED_FILTERS,
} from './action-types';


export function createTask(task, user, cb = (t)=>{}) {
  task.listeners = addUserToListeners(task, user);

  return dispatch => {
    taskList.push(task)
      .then(cb)
      .catch(error => dispatch(createTaskError(error)));
  };
}

export function createTaskError(error) {
  console.warn(`task error: ${error}`);
  return {
    type: CREATE_TASK_ERROR,
    payload: error
  };
}

// Actually the load task is called empty
// Then for each task this function is called
export function createTaskSuccess(task) {
  return {
    type: CREATE_TASK_SUCCESS,
    payload: task
  };
}

export function followTask(task, user) {
  let listeners = task.listeners;

  // Already exists
  if(listeners && listeners.includes(user.id)) {
    return dispatch => { (dispatch(updateTaskError('One cannot listen more then once'))) }
  }

  listeners = addUserToListeners(task, user);

  // TODO perhaps we need to set it back to task.listeners
  return dispatch => {
    taskList.update(task.id, {
      listeners: listeners
    })
      .catch(error => dispatch(updateTaskError(error)));
  };
}

function addUserToListeners(task, user) {
  const listeners = task.listeners || [];

  if(!listeners.includes(user.id)) {
    listeners.push(user.id);
  }
  return listeners
}

function removeUserFromListeners(task, user) {
  if (!task.listeners || task.listeners <= 0) {
    return [];
  }
  return task.listeners.filter(listenerId => listenerId !== user.id);
}

export function unfollowTask(task, user) {
  const listeners = task.listeners;

  // Does not exists
  if(!listeners.includes(user.id)) {
    return dispatch => { (dispatch(updateTaskError('User already not following the task'))) }
  }

  const filteredListeners = removeUserFromListeners(task, user);

  return dispatch => {
    taskList.update(task.id, {
      listeners: filteredListeners
    })
      .catch(error => dispatch(updateTaskError(error)));
  };
}

export function assignTask(task, assignee) {
  return dispatch => {
    // On assign we also add assignee to listeners
    const listeners = addUserToListeners(task, assignee);
    taskList.update(task.id, {
      assignee: {
        email: assignee.email,
        id: assignee.id,
        name: assignee.name,
        photoURL: assignee.photoURL
      },
      listeners: listeners
    })
    .catch(error => dispatch(updateTaskError(error)));
  };
}

export function unassignTask(task) {
  // On unassign we also remove listening
  const filteredListeners = removeUserFromListeners(task, task.assignee);
  return dispatch => {
    taskList.update(task.id, {
      assignee: firebase.firestore.FieldValue.delete(),
      listeners: filteredListeners
    })
    .catch(error => dispatch(updateTaskError(error)));
  };
}

export function removeTask(task) {
  return dispatch => {
    taskList.remove(task.id)
      .catch(error => dispatch(removeTaskError(error)));
  };
}

export function removeTaskError(error) {
  return {
    type: REMOVE_TASK_ERROR,
    payload: error
  };
}

export function removeTaskSuccess(task) {
  return {
    type: REMOVE_TASK_SUCCESS,
    payload: task
  };
}

export function undeleteTaskError(error) {
  return {
    type: UNDELETE_TASK_ERROR,
    payload: error
  };
}

export function updateTaskError(error) {
  return {
    type: UPDATE_TASK_ERROR,
    payload: error
  };
}

export function updateTask(task, changes) {
  return dispatch => {
    taskList.update(task.id, changes)
      .catch(error => dispatch(updateTaskError(error)));
  };
}

export function updateTaskSuccess(task) {
  return {
    type: UPDATE_TASK_SUCCESS,
    payload: task
  };
}

export function loadTasksSuccess(tasks) {
  return {
    type: LOAD_TASKS_SUCCESS,
    payload: tasks
  };
}

export function setFilteredTasks(tasks) {
  return {
    type: SET_FILTERED_TASKS,
    payload: tasks
  };
}

export function setFilters(filters) {
  return {
    type: SET_SELECTED_FILTERS,
    payload: filters
  };
}

export function filterTasks(filterType) {
  return {
    type: FILTER_TASKS,
    payload: {filterType}
  };
}

/* Loads all the tasks for a given project */
export function loadTasks(projectId) {
  return (dispatch, getState) => {
    taskList.rootPath = 'projects';
    taskList.rootDocId = projectId;
    taskList.path = 'tasks';

    taskList.orderBy = {
      name: 'created',
      direction: 'asc'
    };
    taskList.subscribe(dispatch);
  };
}

export function unloadTasks() {
  taskList.unsubscribe();
  return {
    type: UNLOAD_TASKS_SUCCESS
  };
}

export function selectTask(task) {
  return {
    type: SELECT_TASK,
    payload: task
  };
}
