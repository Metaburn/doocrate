import { Record } from 'immutable';


export const Task = new Record({
  id: null,
  title: null,
  assignee: null,
  type: null,
  projectName: null,
  label: { }, //TODO: perhaps null is better here
  created: null,
  dueDate: null,
  creator: null,
  description: null,
  creatorSpecialComments: null,
  communitySpecialComments: null,
  isCritical: false
});
