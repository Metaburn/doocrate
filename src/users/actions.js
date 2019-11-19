/* This is used to show single user details like bio */
import { firebaseDb } from '../firebase';

export function loadUser(userId) {
  return firebaseDb
    .collection('users')
    .doc(userId)
    .get();
}
