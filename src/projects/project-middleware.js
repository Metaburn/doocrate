import { SELECT_PROJECT } from './action-types';
import {firebaseDb} from "../firebase";
import {  getAuth } from 'src/auth';

export const projectMiddleware = ({dispatch, getState}) => next => action => {
  try {
    if (action.type === SELECT_PROJECT && action.payload && action.payload.url) {
      const auth = getAuth(getState());

      if(!auth || !auth.id){
        return next(action);
      }
      const userDoc = firebaseDb.collection('users').doc(auth.id);

      userDoc.get().then((snap)=>{
        let user = snap.data();
        console.log(user)
        if(user && user.defaultProject !== action.payload.url){
          userDoc.update({
            defaultProject: action.payload.url || {}
          }).then(res => {
        //    console.log('defaultProject updated',action.payload, res);
          }).catch(err => {
            console.error(err);
            console.log('With the following user:');
            console.error(auth.id);
            console.error(auth);
          });
        }

      })

    }
  } catch (e) {
    console.error("projectMiddleware failed", e);
  }

  return next(action);

};
