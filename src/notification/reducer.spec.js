import { REMOVE_TASK_SUCCESS } from 'src/tasks/action-types';
import { SHOW_ERROR, SHOW_SUCCESS } from 'src/notification/action-types';
import { DISMISS_NOTIFICATION } from './action-types';
import { notificationReducer } from './reducer';

describe('Notification reducer', () => {
  describe('REMOVE_TASK_SUCCESS', () => {
    it('should return correct state', () => {
      const nextState = notificationReducer(undefined, {
        type: REMOVE_TASK_SUCCESS,
        task: {},
      });

      expect(nextState.actionLabel).toBe('');
      expect(nextState.display).toBe(true);
      expect(nextState.type).toBe('success');
    });
  });

  describe('SHOW_ERROR', () => {
    it('should return correct state', () => {
      const nextState = notificationReducer(undefined, {
        type: SHOW_ERROR,
        payload: 'Error occurred',
      });

      expect(nextState.message).toBe('Error occurred');
      expect(nextState.display).toBe(true);
      expect(nextState.type).toBe('error');
    });
  });

  describe('SHOW_SUCCESS', () => {
    it('should return correct state', () => {
      const nextState = notificationReducer(undefined, {
        type: SHOW_SUCCESS,
        payload: 'Just believe in yourself',
      });

      expect(nextState.message).toBe('Just believe in yourself');
      expect(nextState.display).toBe(true);
      expect(nextState.type).toBe('success');
    });
  });

  describe('DISMISS_NOTIFICATION', () => {
    it('should return correct state', () => {
      const nextState = notificationReducer(undefined, {
        type: DISMISS_NOTIFICATION,
      });

      expect(nextState.actionLabel).toBe('');
      expect(nextState.display).toBe(false);
      expect(nextState.message).toBe('');
    });
  });
});
