import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { firebase, getFirestore } from '../../../shared/services/firebase-init';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private get db() { return getFirestore(); }
  private get auth() { return firebase.auth(); }

  constructor(private route: Router) { }

  login(email: string, password: string): Promise<any> {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  loginWithPopup(provider: string): Promise<any> {
    switch (provider) {
      case 'google':
        return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      case 'facebook':
        return this.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
      default:
        return Promise.reject('Unknown provider');
    }
  }

  signupByEailPassword(email: string, password: string): Promise<any> {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  getUserProfile(uid: string): Observable<any> {
    return new Observable(subscriber => {
      this.db.collection('users').doc(uid).get()
        .then(doc => {
          subscriber.next(!doc.exists ? null : { ...doc.data(), id: doc.id });
          subscriber.complete();
        })
        .catch(err => subscriber.error(err));
    });
  }

  logout() {
    this.auth.signOut();
    localStorage.removeItem('authToken');
    localStorage.removeItem('proifleDetail');
    this.route.navigate(['/auth']);
  }
}
