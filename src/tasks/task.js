import { Record } from 'immutable';


export const Task = new Record({
  id: null,
  title: null,
  assignee: null,
  type: null,
  projectName: null,
  label: { }, //TODO: perhaps null is better here
  createdDate: null,
  dueDate: null,
  creator: null,
  description: null,
  creatorSpecialComments: null,
  communitySpecialComments: null,
  relevantContacts: null,
  isCritical: false
});
