import { FirebaseList } from 'src/firebase';
import * as projectActions from './project-actions';
import { Project } from './project';


export const projectList = new FirebaseList({
  onAdd: projectActions.createProjectSuccess,
  onChange: projectActions.updateProjectSuccess,
  onLoad: projectActions.loadProjectsSuccess,
  onRemove: projectActions.removeProjectSuccess
}, Project);
