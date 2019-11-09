import { FirebaseList } from 'src/firebase';
import * as invitationsActions from './actions';
import { Invitation } from './invitation';

export const invitationsList = new FirebaseList({
  onAdd: invitationsActions.addEmailSuccess,
}, Invitation);
