import { FirebaseList } from 'src/firebase';
import * as InvitationActions from './actions';
import { Record } from 'immutable';

export const InvitationList = new Record({
  id: null,
  created: null,
  updated: null,
  projectId: null,
  name: null,
  creatorId: null,
  creator: null,
  url: null,
  canAdd: false,
  canAssign: false,
  canComment: false,
  canView: false,
});

export const invitationListFirebaseList = new FirebaseList(
  {
    onAdd: InvitationActions.createInvitationListSuccess,
    onLoad: InvitationActions.loadInvitationListSuccess,
  },
  InvitationList,
  'invitation_lists',
);
