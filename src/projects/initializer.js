import * as projectsActions from "../projects/actions";
import {firebaseDb} from "../firebase";
import {selectProject} from "./actions";

// Select the project from the url by parsing the window url for project and
// Initializing the store with it
export function initProject(dispatch) {
  return new Promise((resolve, reject) => {
    const projectUrl = projectsActions.getProjectFromUrl();
    // Project url might be /sign-in in the case of sign in (Before user auth)
    if (!projectUrl || projectUrl === 'sign-in') {
      return resolve();
    }
    firebaseDb.collection('projects').doc(projectUrl).get().then(snapshot => {
        if(snapshot.exists) {
          const project = snapshot.data();
          dispatch(selectProject(project));
        }
      resolve();
    })
  })

};
