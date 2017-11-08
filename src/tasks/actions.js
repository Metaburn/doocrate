import { taskList } from './task-list';
import { auditRecordActions } from '../audit-records'
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
} from './action-types';

const TASK_ENTITY_TYPE = "TASK"
const TASK_ACTION = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE'
}

export function createTask(task, cb = (t)=>{}) {
  const getTask = task
  return (dispatch, getState) => {
    return taskList.push(task).then(cb).then(() => {
      const session = getState()

      return auditRecordActions.createAuditRecord({
          action: TASK_ACTION.CREATE,
          performer: session.auth.toJS(),
          entitySnapshot: getTask,
          entityType: TASK_ENTITY_TYPE
        })
    }).catch(error => dispatch(createTaskError(error)));
  };
}

export function createTaskError(error) {
  console.warn(`task error: ${error}`)
  return {
    type: CREATE_TASK_ERROR,
    payload: error
  };
}

export function createTaskSuccess(task, isLocallyCreated) {
  return dispatch => {
    dispatch({
      type: CREATE_TASK_SUCCESS,
      payload: task
    })
  }
}

export function assignTask(task, assignee) {
  return (dispatch, getState) => {
    updateTaskAndLog(task, {
      assignee: {
        email: assignee.email,
        id: assignee.id,
        name: assignee.name,
        photoURL: assignee.photoURL
      }
    }, getState)
    .catch(error => dispatch(updateTaskError(error)));
  };
}

const updateTaskAndLog = (task, update, getState) => {
  const getTask = Object.assign(task, update)
  return taskList.update(task.id, update).then(task => {
    const session = getState()

    return auditRecordActions.createAuditRecord({
      action: TASK_ACTION.UPDATE,
      performer: session.auth.toJS(),
      entitySnapshot: getTask,
      entityType: TASK_ENTITY_TYPE
    })
  })
}

export function unassignTask(task) {
  return (dispatch, getState) => {
    updateTaskAndLog(task, {
      assignee: firebase.firestore.FieldValue.delete()
    }, getState)
    .catch(error => dispatch(updateTaskError(error)));
  };
}

export function removeTask(task) {
  const getTask = task
  return (dispatch, getState) => {
    taskList.remove(task.id).then(task => {
      const session = getState()

      return auditRecordActions.createAuditRecord({
        action: TASK_ACTION.DELETE,
        performer: session.auth.toJS(),
        entitySnapshot: getTask,
        entityType: TASK_ENTITY_TYPE
      })
    })
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
  return (dispatch, getState) => {
    dispatch({
      type: REMOVE_TASK_SUCCESS,
      payload: task
    })    
  }
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
  return (dispatch, getState) => {
    updateTaskAndLog(task, changes, getState)
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

export function loadTasks() {
  return (dispatch, getState) => {
    const { auth } = getState();
    taskList.path = `tasks`;
    taskList.orderBy = {
      name: 'created',
      direction: 'asc'
    }
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
