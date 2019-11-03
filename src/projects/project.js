import { Record } from 'immutable';


export const Project = new Record({
  name: null,
  url: null,
  creator: null,
  taskTypes: null,
  popularTags: null,
  extraFields: null,
  canCreateTask: null,
  canAssignTask: null,
  language: null,
  domainUrl: null
});


