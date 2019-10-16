import { Record } from 'immutable';


export const Task = new Record({
  id: null,
  title: null,
  assignee: null,
  type: null,
  projectName: null,
  label: { },
  listeners: [],
  created: null,
  dueDate: null,
  creator: null,
  isDone: false,
  doneDate: null,
  description: null,
  requirements: null,
  isCritical: false,
  extraFields: null
});
