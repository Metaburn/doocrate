import { List, Record } from 'immutable';
import { ADD_EMAIL_SUCCESS } from './action-types';

import { firebaseCollectionToList } from 'src/firebase/firebase-list';

export const InvitationsState = new Record({
  deleted: null,
  list: new List(),
  previous: null,
  auth: null
});


export function commentsReducer(state = new InvitationsState(), {payload, type}) {
  switch (type) {
    case ADD_EMAIL_SUCCESS:
        break;
    default:
      return state;
  }
}
