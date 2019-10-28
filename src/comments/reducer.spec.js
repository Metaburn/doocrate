import { List } from 'immutable';
import { SIGN_OUT_SUCCESS } from 'src/auth/action-types';

import {
  CREATE_COMMENT_SUCCESS,
  REMOVE_COMMENT_SUCCESS,
  FILTER_COMMENTS,
  LOAD_COMMENTS_SUCCESS,
  UPDATE_COMMENT_SUCCESS
} from './action-types';

import { Comment } from './comment';
import { commentsReducer, CommentsState } from './reducer';

class FirebaseCommentObject {
  constructor(props) {
    this._object = new Comment({id: props.id, 'body': props.body});
  }

  data() { return this._object }
}

describe('Comments reducer', () => {
  let comment1;
  let comment2;

  // We use the firebase like structure to emulate the data that we are actually using
  beforeEach(() => {

    comment1 = new FirebaseCommentObject({id:0, body: 'comment 1'});
    comment2 = new FirebaseCommentObject({id:1, body: 'comment 2'});
  });


  describe('CREATE_COMMENT_SUCCESS', () => {
    it('should prepend new comment to list', () => {
      let state = new CommentsState({list: new List([comment1])});

      let nextState = commentsReducer(state, {
        type: CREATE_COMMENT_SUCCESS,
        payload: comment2
      });

      expect(nextState.list.get(0)).toBe(comment2);
      expect(nextState.list.get(1)).toBe(comment1);
    });
  });


  describe('REMOVE_COMMENT_SUCCESS', () => {
    it('should remove comment from list', () => {
      let state = new CommentsState({list: new List([comment1, comment2])});

      let nextState = commentsReducer(state, {
        type: REMOVE_COMMENT_SUCCESS,
        payload: comment2.data()
      });

      expect(nextState.deleted).toBe(comment2.data());
      expect(nextState.list.size).toBe(1);
      expect(nextState.list.get(0)).toBe(comment1);
      expect(nextState.previous).toBe(state.list);
    });
  });


  // describe('LOAD_COMMENTS_SUCCESS', () => {
  //   it('should set comment list', () => {
  //     let state = new CommentsState();
  //
  //     let nextState = commentsReducer(state, {
  //       type: LOAD_COMMENTS_SUCCESS,
  //       payload: [comment1, comment2]
  //     });
  //
  //     expect(nextState.list.size).toBe(2);
  //   });
  //
  //   it('should order comments newest first', () => {
  //     let state = new CommentsState();
  //
  //     let nextState = commentsReducer(state, {
  //       type: LOAD_COMMENTS_SUCCESS,
  //       payload: [comment1, comment2]
  //     });
  //
  //     expect(nextState.list.get(0)).toBe(comment2);
  //     expect(nextState.list.get(1)).toBe(comment1);
  //   });
  // });


  describe('UPDATE_COMMENT_SUCCESS', () => {
    it('should update comment', () => {
      let state = new CommentsState({list: new List([comment1, comment2])});
      comment2.data().set('body', 'changed');

      let nextState = commentsReducer(state, {
        type: UPDATE_COMMENT_SUCCESS,
        payload: comment2
      });

      expect(nextState.list.get(0).body).toBe(comment1.body);
      expect(nextState.list.get(1).body).toBe(comment2.body);
    });
  });


  describe('SIGN_OUT_SUCCESS', () => {
    it('should reset state', () => {
      let state = new CommentsState({
        delete: comment1,
        list: new List([comment1, comment2]),
        previous: new List()
      });

      let nextState = commentsReducer(state, {
        type: SIGN_OUT_SUCCESS
      });

      expect(nextState.deleted).toBe(null);
      expect(nextState.list.size).toBe(0);
      expect(nextState.previous).toBe(null);
    });
  });
});
