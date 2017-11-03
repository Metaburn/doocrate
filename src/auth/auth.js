import { firebaseAuth, firebaseDb } from 'src/firebase';
import * as authActions from './actions';


export function initAuth(dispatch) {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(
      authUser => {
        getIsGuide(authUser).then(isGuide => {
          if(authUser) {
            authUser.role = isGuide.exists? 'guide' : 'user';
          }
          getIsAdmin(authUser).then(isAdmin => {
            if(authUser) {
              authUser.role = isAdmin.exists? 'admin': authUser.role;
            }
            dispatch(authActions.initAuth(authUser));
            updateUserData(authUser);
            unsubscribe();
            resolve();
          })
        })
      },
      error => reject(error)
    );
  });
}

// TODO: perhaps should be in a better place and check if operation success
function updateUserData(authUser) {
  if(!authUser || !authUser.uid) {
    return;
  }
  const userDoc = firebaseDb.collection('users').doc(authUser.uid);
  if(!userDoc.exists) {
    userDoc.set({
    name: authUser.displayName,
    email: authUser.email,
    photoURL : authUser.photoURL,
    created: new Date()
    })
  }
}

// TODO - instead of await that waits for all users
// We should load the interface and then make another call - for faster loading
function getIsAdmin(authUser) {
  if(!authUser) {
    return new Promise( (resolve, reject) => {
      resolve('guest');
    })
  }
  return firebaseDb.collection('admins').doc(authUser.uid).get();
}

// TODO - instead of await that waits for all users
// We should load the interface and then make another call - for faster loading
function getIsGuide(authUser) {
  if(!authUser) {
    return new Promise( (resolve, reject) => {
      resolve('guest');
    })
  }
  return firebaseDb.collection('guides').doc(authUser.uid).get();
}