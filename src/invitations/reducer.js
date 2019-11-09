import { List, Record } from 'immutable';
import { ADD_EMAILS_SUCCESS } from './action-types';

import { firebaseCollectionToList } from 'src/firebase/firebase-list';

export const InvitationsState = new Record({
  deleted: null,
  selectedTask: null,
  list: new List(),
  previous: null,
  auth: null
});


export function commentsReducer(state = new InvitationsState(), {payload, type}) {
  switch (type) {
    case ADD_EMAILS_SUCCESS:
      return state.merge({
        deleted: null,
        previous: null,
        list: state.deleted && state.deleted.id === payload.id ?
          state.previous :
          state.list.unshift(payload)
      });

    case REMOVE_COMMENT_SUCCESS:
      return state.merge({
        deleted: payload,
        previous: state.list,
        list: state.list.filter(comment => comment.id !== payload.id)
      });

    case LOAD_COMMENTS_SUCCESS:
      return state.set('list', new List(firebaseCollectionToList(payload.reverse())));

    case UNLOAD_COMMENTS_SUCCESS:
      return state.set('list', new List());

    case UPDATE_COMMENT_SUCCESS:
      return state.merge({
        deleted: null,
        previous: null,
        list: state.list.map(comment => {
          return comment.id === payload.id ? payload : comment;
        })
      });

    case SIGN_OUT_SUCCESS:
      return new CommentsState();

    case SELECT_TASK:
      return state.set('selectedTask', payload || null);

    default:
      return state;
  }
}
