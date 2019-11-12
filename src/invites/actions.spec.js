import { InvitationStatus } from "./invitation";
import * as actions from "./actions";
import * as types from "./action-types";
import { List } from "immutable";
import { firebaseCollectionToList } from "src/firebase/firebase-list";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Invitation Actions", () => {
  let invitation1;
  let invitation2;

  beforeEach(() => {
    invitation1 = {
      invitationListId: "inId1",
      email: "test@gmail.com",
      created: Date(),
      status: InvitationStatus.INVITED,
      userId: "usId1"
    };

    invitation2 = {
      invitationListId: "inId2",
      email: "test2@gmail.com",
      created: Date(),
      status: InvitationStatus.PENDING_REGISTRATION,
      userId: "usId2"
    };
  });

  describe("CREATE_INVITATION_SUCCESS", () => {
    it("Should create invitation on the firestore and returning it successfully", () => {
      const store = mockStore({
        invitations: new List(),
        selectedInvitationList: null
      });

      return store
        .dispatch(actions.createInvitation(invitation1))
        .then(async () => {
          // return of async actions
          expect(store.getActions()).toHaveLength(1);
          const result = store.getActions()[0];

          expect(result.type).toBe(types.CREATE_INVITATION_SUCCESS);

          const invitationObj = await result.payload.get;

          expect(invitationObj).toBeDefined();
        });
    });
  });
});
