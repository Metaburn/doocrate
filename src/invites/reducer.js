import { List, Record } from 'immutable';
import { showError } from 'src/notification/actions';
import {
  CREATE_INVITATION_LIST_SUCCESS,
  LOAD_INVITATION_LIST_SUCCESS,
  LOAD_INVITATIONS_SUCCESS,
  CREATE_INVITATION_SUCCESS,
  CREATE_INVITATION_ERROR,
  CREATE_INVITATION_LIST_ERROR,
  UPDATE_INVITATION_LIST_ERROR,
  UPDATE_INVITATION_LIST_SUCCESS,
} from './action-types';

import { firebaseCollectionToList } from 'src/firebase/firebase-list';

export const InvitesState = new Record({
  invitations: new List(),
  selectedInvitationList: null,
});

export function invitesReducer(state = new InvitesState(), { payload, type }) {
  switch (type) {
    case CREATE_INVITATION_LIST_SUCCESS:
    case LOAD_INVITATION_LIST_SUCCESS:
      return state.set('selectedInvitationList', payload);

    case CREATE_INVITATION_SUCCESS:
      return state.merge({
        invitations: state.invitations.unshift(payload),
      });

    case UPDATE_INVITATION_LIST_SUCCESS:
      // TODO
      return state;

    case LOAD_INVITATIONS_SUCCESS:
      return state.set(
        'invitations',
        new List(firebaseCollectionToList(payload)),
      );

    // return state.merge(newState);
    case CREATE_INVITATION_ERROR:
    case CREATE_INVITATION_LIST_ERROR:
    case UPDATE_INVITATION_LIST_ERROR:
      return showError(payload);

    default:
      return state;
  }
}
