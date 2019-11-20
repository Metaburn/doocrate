import { List } from 'immutable';
import { SIGN_OUT_SUCCESS } from 'src/auth/action-types';

import {
  CREATE_TASK_SUCCESS,
  REMOVE_TASK_SUCCESS,
  UPDATE_TASK_SUCCESS,
} from './action-types';

import { Task } from './task';
import { tasksReducer, TasksState } from './reducer';
import { commentsReducer, CommentsState } from '../comments/reducer';
import { REMOVE_COMMENT_SUCCESS } from '../comments/action-types';

class FirebaseTaskObject {
  constructor(props) {
    this._object = new Task({
      id: props.id,
      completed: props.completed,
      title: props.title,
    });
  }

  get id() {
    return this._object.id;
  }

  data() {
    return this._object;
  }
}

describe('Tasks reducer', () => {
  let task1;
  let task2;

  beforeEach(() => {
    task1 = new FirebaseTaskObject({
      completed: false,
      id: 0,
      title: 'task 1',
    });
    task2 = new FirebaseTaskObject({
      completed: false,
      id: 1,
      title: 'task 2',
    });
  });

  describe('CREATE_TASK_SUCCESS', () => {
    it('should prepend new task to list', () => {
      const state = new TasksState({ list: new List([task1]) });
      const nextState = tasksReducer(state, {
        type: CREATE_TASK_SUCCESS,
        payload: task2,
      });

      expect(nextState.list.get(0)).toBe(task1);
      expect(nextState.list.get(1)).toBe(task2);
    });
  });

  describe('REMOVE_TASK_SUCCESS', () => {
    it('should remove task from list', () => {
      const state = new TasksState({ list: new List([task1, task2]) });

      const nextState = tasksReducer(state, {
        type: REMOVE_TASK_SUCCESS,
        payload: task1,
      });

      expect(nextState.deleted).toBe(task1);
      expect(nextState.list.size).toBe(1);
      expect(nextState.list.get(0)).toBe(task2);
      expect(nextState.previous).toBe(state.list);
    });
  });

  // describe('LOAD_TASKS_SUCCESS', () => {
  //   it('should set task list', () => {
  //     let state = new TasksState();
  //
  //     let nextState = tasksReducer(state, {
  //       type: LOAD_TASKS_SUCCESS,
  //       payload: [task1, task2]
  //     });
  //
  //     expect(nextState.list.size).toBe(2);
  //   });
  //
  //   it('should order tasks newest first', () => {
  //     let state = new TasksState();
  //
  //     let nextState = tasksReducer(state, {
  //       type: LOAD_TASKS_SUCCESS,
  //       payload: [task1, task2]
  //     });
  //
  //     expect(nextState.list.get(0)).toBe(task2);
  //     expect(nextState.list.get(1)).toBe(task1);
  //   });
  // });

  describe('UPDATE_TASK_SUCCESS', () => {
    it('should update task', () => {
      const state = new TasksState({ list: new List([task1, task2]) });
      task1.data().set('title', 'changed');

      const nextState = tasksReducer(state, {
        type: UPDATE_TASK_SUCCESS,
        payload: task1,
      });

      expect(nextState.list.size).toBe(2);
      expect(nextState.list.get(0).title).toBe(task1.title);
      expect(nextState.list.get(1).title).toBe(task2.title);
    });
  });

  describe('SIGN_OUT_SUCCESS', () => {
    it('should reset state', () => {
      const state = new TasksState({
        delete: task1,
        list: new List([task1, task2]),
        previous: new List(),
      });

      const nextState = tasksReducer(state, {
        type: SIGN_OUT_SUCCESS,
      });

      expect(nextState.deleted).toBe(null);
      expect(nextState.list.size).toBe(0);
      expect(nextState.previous).toBe(null);
    });
  });
});
