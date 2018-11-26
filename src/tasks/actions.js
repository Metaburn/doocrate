import { taskList } from './task-list';
import firebase from 'firebase/app';

import {
  INCOMPLETE_TASKS,
  COMPLETED_TASKS,
  ALL_TASKS,
} from './filter-types';

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
} from './action-types';
import {commentList} from "../comments/comment-list";
import {INIT_AUTH} from "../auth/action-types";


export function createTask(task, cb = (t)=>{}) {
  return dispatch => {
    return taskList.push(task).then(cb)
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

export function createTaskSuccess(task) {
  return {
    type: CREATE_TASK_SUCCESS,
    payload: task
  };
}

export function assignTask(task, assignee) {
  return dispatch => {
    taskList.update(task.id, {
      assignee: {
        email: assignee.email,
        id: assignee.id,
        name: assignee.name,
        photoURL: assignee.photoURL
      }
    })
    .catch(error => dispatch(updateTaskError(error)));
  };
}

export function unassignTask(task) {
  return dispatch => {
    taskList.update(task.id, {
      assignee: firebase.firestore.FieldValue.delete()
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
