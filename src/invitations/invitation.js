import { Record } from 'immutable';

export const INVITATION_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED"
}
export const Invitation = new Record({
  id: null,
  invitationListId: null,
  email: null,
  created: null,
  status: null,
  userId: null
});
