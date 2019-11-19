import { FirebaseList } from 'src/firebase';
import * as InvitationActions from './actions';
import { Record } from 'immutable';

export const InvitationStatus = {
  INVITED: 'INVITED',
  RECEIVED: 'RECEIVED',
  PENDING_REGISTRATION: 'PENDING_REGISTRATION',
  ACCEPTED: 'ACCEPTED',
  REMOVED: 'REMOVED',
  ERROR: 'ERROR',
};

export const Invitation = new Record({
  id: null,
  invitationListId: null,
  email: null,
  created: null,
  status: null,
  userId: null,
});

export const invitationFirebaseList = new FirebaseList(
  {
    onAdd: InvitationActions.createInvitationSuccess,
    onLoad: InvitationActions.loadInvitationsSuccess,
    onChange: InvitationActions.updateInvitationSuccess,
  },
  Invitation,
  'invitations'
);
