import { List } from 'immutable';
import { Invitation, InvitationStatus } from './invitation';
import { invitesReducer, InvitesState } from './reducer';
import { CREATE_INVITATION_SUCCESS } from './action-types';

class FirebaseInvitationMockObject {
  constructor(props) {
    this._object = new Invitation({
      id: props.id,
      invitationListId: props.invitationListId,
      email: props.email,
      created: props.created,
      status: props.status,
      userId: props.userId,
    });
  }

  get id() {
    return this._object.id;
  }

  data() {
    return this._object;
  }
}

describe('Invitation Reducer', () => {
  let invitation1;
  let invitation2;

  beforeEach(() => {
    invitation1 = new FirebaseInvitationMockObject({
      id: 'id0',
      invitationListId: 'inId1',
      email: 'test@gmail.com',
      created: Date(),
      status: InvitationStatus.INVITED,
      userId: 'usId1',
    });

    invitation2 = new FirebaseInvitationMockObject({
      id: 'id1',
      invitationListId: 'inId2',
      email: 'test2@gmail.com',
      created: Date(),
      status: InvitationStatus.PENDING_REGISTRATION,
      userId: 'usId2',
    });
  });

  describe('CREATE_INVITATION_SUCCESS', () => {
    it('should add new invitation to the invitations list', () => {
      const state = new InvitesState({
        invitations: new List([invitation1]),
      });

      const nextState = invitesReducer(state, {
        type: CREATE_INVITATION_SUCCESS,
        payload: invitation2,
      });

      expect(nextState.invitations.get(0)).toBe(invitation2);
      expect(nextState.invitations.get(1)).toBe(invitation1);
    });
  });
});
