import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { env } from '../../../environments/environment';

if (!firebase.apps.length) {
  firebase.initializeApp(env.firebaseConfig);
}

export function getFirestore() {
  return firebase.firestore();
}

let authInitialized = false;
const authReadyPromise = new Promise<any>((resolve) => {
  const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
    authInitialized = true;
    unsubscribe();
    resolve(user);
  });
});

export function waitForAuth(): Promise<any> {
  // If auth already initialized, return current user immediately
  if (authInitialized) {
    return Promise.resolve(firebase.auth().currentUser);
  }
  return authReadyPromise;
}

export { firebase };
