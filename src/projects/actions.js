import { projectList } from './project-list';

import {
  CREATE_PROJECT_ERROR,
  CREATE_PROJECT_SUCCESS,
  REMOVE_PROJECT_ERROR,
  REMOVE_PROJECT_SUCCESS,
  LOAD_PROJECTS_SUCCESS,
  UNLOAD_PROJECTS_SUCCESS,
  UPDATE_PROJECT_ERROR,
  UPDATE_PROJECT_SUCCESS, NEW_PROJECT_CREATED,
} from './action-types';
import { SELECT_PROJECT } from "./action-types";
import {firebaseDb} from "../firebase";
import { getCookie, getUrlSearchParams } from "../utils/browser-utils";
import { getAuth } from "../auth";
import history from "../history";


export const initProject = () => (dispatch, getState) => {
    const projectUrl = getProjectFromUrl();
    const params = getUrlSearchParams();
    const isShowAllProjects = params['show'];
    // User url might be /sign-in in the case of sign in (Before user auth)
    // Dont redirect when a user presses on the show all projects
    if (projectUrl === 'sign-in' || projectUrl === 'me' || projectUrl === 'logout' || isShowAllProjects || projectUrl === "create-project") {
      return;
    }

    const invalidProjectValues = ["[object Object]", "null"];

    let selectedProject = null;
    let auth = null;
    if(getState){
      auth = getAuth(getState());
    }
    if(projectUrl && !invalidProjectValues.includes(projectUrl)){
      selectedProject = projectUrl;
    } else if(auth && auth.defaultProject) {
      // select user to default project
      selectedProject = auth.defaultProject;
    }else {
      const selectedProject = getCookie('project');
      // not found or corrupted project - need to select
      if (!selectedProject || invalidProjectValues.includes(projectUrl)) {
        history.push('/');
        return;
      }
    }

    if(selectedProject){
      // Listen for project changes
      firebaseDb.collection('projects').doc(selectedProject).onSnapshot({
          // Listen for document metadata changes
          includeMetadataChanges: true
        }, (doc) => {
          const project = doc.data();
          dispatch(selectProject(project));
        }
      );


      firebaseDb.collection('projects').doc(selectedProject).get().then(snapshot => {
        if(snapshot.exists) {
          const project = snapshot.data();
          dispatch(selectProject(project));
          history.push('/'+ selectedProject +'/task/1');
        }else {
          history.push('/');
        }
      })
    }else {
      history.push('/');
    }
};

export function createProject(projectId, project) {
  projectList.path = `projects`;
  return dispatch => {
    projectList.set(projectId,
      project)
      .then( () => {
        return dispatch(newProjectCreated(project))
      })
      .catch(error => {
        console.error(error);
        const errorMessage = (error && error.message) ? error.message : error;
        return dispatch(createProjectError(errorMessage))
      });
  };
}

export function createProjectError(error) {
  return {
    type: CREATE_PROJECT_ERROR,
    payload: error
  };
}

export function newProjectCreated(project) {
  return {
    type: NEW_PROJECT_CREATED,
    payload: project
  };
}

export function createProjectSuccess(project) {
  return {
    type: CREATE_PROJECT_SUCCESS,
    payload: project
  };
}

export function removeProject(project) {
  return dispatch => {
    projectList.remove(project.id)
      .catch(error => dispatch(removeProjectError(error)));
  };
}

export function removeProjectError(error) {
  return {
    type: REMOVE_PROJECT_ERROR,
    payload: error
  };
}

export function removeProjectSuccess(project) {
  return {
    type: REMOVE_PROJECT_SUCCESS,
    payload: project
  };
}

export function updateProjectError(error) {
  return {
    type: UPDATE_PROJECT_ERROR,
    payload: error
  };
}

export function updateProject(project, changes) {
  return dispatch => {
    projectList.update(project.id, changes)
      .catch(error => dispatch(updateProjectError(error)));
  };
}

export function updateProjectSuccess(project) {
  return {
    type: UPDATE_PROJECT_SUCCESS,
    payload: project
  };
}

export function loadProjectsSuccess(projects) {
  return {
    type: LOAD_PROJECTS_SUCCESS,
    payload: projects
  };
}

// We are hiding any projects that are not public
// TODO: It's only done on the client side so you can still filter by a project name
export function loadProjects() {
  return (dispatch, getState) => {
    projectList.path = `projects`;
    projectList.query = ['isPublic', '==', true];
    projectList.orderBy = {
      name: 'created',
      direction: 'asc'
    };

    projectList.subscribe(dispatch);
  };
}

export function unloadProjects() {
  projectList.unsubscribe();
  return {
    type: UNLOAD_PROJECTS_SUCCESS
  };
}

// Parse the /project parameter from the url
export function getProjectFromUrl() {
  const url = new URL(window.location.href);
  const urlSplitted = url.pathname.split('/');
  if(urlSplitted && urlSplitted.length > 1 && urlSplitted[1]) {
    //right after the first char
    return urlSplitted[1];
  }
  return null;
}

// Use the browser url to get the project id and then get the actual project and select it
export function selectProjectFromUrl() {
  return dispatch => {
    const projectUrl = getProjectFromUrl();

    if (!projectUrl) {
      return;
    }
    firebaseDb.collection('projects').doc(projectUrl).get().then(snapshot => {
      if (snapshot.exists) {
        const project = snapshot.data();
        return dispatch(selectProject(project));
      }
    });
  }
}

export function selectProject(project) {
  return {
    type: SELECT_PROJECT,
    payload: project
  };
}
