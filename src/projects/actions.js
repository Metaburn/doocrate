import { projectList } from './project-list';

import {
  CREATE_PROJECT_ERROR,
  CREATE_PROJECT_SUCCESS,
  REMOVE_PROJECT_ERROR,
  REMOVE_PROJECT_SUCCESS,
  LOAD_PROJECTS_SUCCESS,
  UNLOAD_PROJECTS_SUCCESS,
  UPDATE_PROJECT_ERROR,
  UPDATE_PROJECT_SUCCESS,
  NEW_PROJECT_CREATED,
  SET_USER_PERMISSIONS,
  SET_USER_PERMISSIONS_ERROR
} from './action-types';
import { SELECT_PROJECT } from "./action-types";
import {firebaseDb} from "../firebase";
import {firebaseApp} from "../firebase";
import { getCookie, getUrlSearchParams } from "../utils/browser-utils";
import { getAuth } from "../auth";
import history from "../history";
import {firebaseConfig} from "src/firebase/config";

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
      selectedProject = getCookie('project');
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
          // Project doesn't exists
          if(project === undefined) {
            history.push('/');
          }else {
            selectProject(dispatch, project);
            // We only navigates if this is root. Otherwise we keep the url
            if(window.location.pathname === "/") {
              history.push('/' + selectedProject + '/task/1');
            }
          }
        }
      );
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

function selectProjectFromProjectUrlAndDispatch(dispatch, projectUrl) {
  firebaseDb.collection('projects').doc(projectUrl).get().then(snapshot => {
    if (snapshot.exists) {
      const project = snapshot.data();
      return selectProject(dispatch, project);
    }
  });
}

export function selectProjectFromProjectUrl(projectUrl) {
  return dispatch => {
    return selectProjectFromProjectUrl(dispatch, projectUrl);
  }
}

// Use the browser url to get the project id and then get the actual project and select it
export function selectProjectFromUrl() {
  return dispatch => {
    const projectUrl = getProjectFromUrl();
    if (!projectUrl) {
      return;
    }
    return selectProjectFromProjectUrlAndDispatch(dispatch, projectUrl)
  }
}


/**
 * When the user selects a project we check for permissions
 */
export function selectProject(dispatch, project) {
  if(!project) { return }
  fetchUserPermissions(project.url).then( (userPermissions) => {
    dispatch(userPermissions);
  });

  dispatch(
    {
      type: SELECT_PROJECT,
      payload: project
    }
  );
}

export async function fetchUserPermissions(projectUrl) {
  let serverUrl = '';
  // To support local and dev we set this to staging
  if (process.env.NODE_ENV !== 'production') {
    serverUrl = `https://${firebaseConfig.defaultDomain}`;
  }

  const token = await firebaseApp.auth().currentUser.getIdToken();
  const request = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
      "Host": "staging.doocrate.com",
    }
  };

  const response = await fetch(`${serverUrl}/api/auth/project_permissions?project=${projectUrl}`, request);
  if (response.ok) {
    return setUserPermissions(await response.json());
  } else {
    return setUserPermissionsError(response);
  }
}

export function setUserPermissions(payload) {
  return{
    type: SET_USER_PERMISSIONS,
    payload: payload
  }
}

export function setUserPermissionsError(error) {
  return {
    type: SET_USER_PERMISSIONS_ERROR,
    payload: error
  };
}
