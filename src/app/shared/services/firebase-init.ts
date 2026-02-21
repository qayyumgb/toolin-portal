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

export { firebase };
