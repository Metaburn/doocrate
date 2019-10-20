import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import { authReducer } from './auth';
import { notificationReducer } from './notification';
import { tasksReducer } from './tasks';
import { commentsReducer } from './comments';
import { labelsReducer } from './labels';
import { projectsReducer } from './projects';
import { userInterfaceReducer } from './user-interface';


export default combineReducers({
  auth: authReducer,
  notification: notificationReducer,
  routing: routerReducer,
  tasks: tasksReducer,
  comments: commentsReducer,
  labels: labelsReducer,
  projects: projectsReducer,
  userInterface: userInterfaceReducer,
});
