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

            getUserInfo(authUser).then(userInfo => {
              if(userInfo && userInfo.exists) {
                const userInfoData = userInfo.data()
                authUser.isEmailConfigured = userInfoData.isEmailConfigured;
                authUser.updatedEmail = userInfoData.email;
              }else {
                // Only update the fields if no user data exists
                updateUserData(authUser);
              }
              dispatch(authActions.initAuth(authUser));

              unsubscribe();
              resolve();
            });
          })
        })
      },
      error => reject(error)
    );
  });
}

// TODO: perhaps should be in a better place and check if operation success
export function updateUserData(authUser) {
  if(!authUser || !authUser.uid) {
    return;
  }
  const userDoc = firebaseDb.collection('users').doc(authUser.uid);
  userDoc.get().then( userSnapshot => {
    if (!userSnapshot.exists) {
      userDoc.set({

        name: authUser.displayName,
        email: authUser.email,
        photoURL: authUser.photoURL,
        created: new Date()
      })
    } else {
      // For existing users check if we set the isEmailConfigured flag. We use it to allow users on first time to
      // set their emails

      // Only if the given object state we should update the email then we do so
        if (authUser.isEmailConfigured) {
          // Update user details
          userDoc.set({
            name: authUser.displayName,
            email: authUser.email,
            isEmailConfigured: true,
            updated: new Date()
          }, { merge: true })
        }
    }
  })
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

// TODO - instead of await that waits for all users
// We should load the interface and then make another call - for faster loading
function getUserInfo(authUser) {
  if(!authUser) {
    return new Promise( (resolve, reject) => {
      resolve(null);
    })
  }
  return firebaseDb.collection('users').doc(authUser.uid).get();
}
