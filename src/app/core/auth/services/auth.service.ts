import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { catchError, Observable } from 'rxjs';



import {
  getAuth, signInWithPopup, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signOut
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { env } from '../../../../environments/environment';
import { authEndpoints } from '../../../constant/api/apiEndpoints';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private http: HttpClient, private fireauth: AngularFireAuth, private route: Router) { }

  auths = initializeApp(env.firebaseConfig)

  login(email: string, password: string): Promise<any> {
    const auth = getAuth(this.auths);
    return signInWithEmailAndPassword(auth, email, password)
  }


  providerAuth(providerAuth: string, token: any): Observable<any> {
    let url
    switch (providerAuth) {
      case "google":
        url = authEndpoints.googleAuth;
        break;
      case "facebook":
        url = authEndpoints.facebookAuth;
        break;
    }
    return this.http.post<any>(`${env.base}${url}`, token)
  }


  loginWithPopup(provider: string): Promise<any> {
    const gp = new GoogleAuthProvider()
    const fp = new FacebookAuthProvider();
    let returnResponse: any = {};
    switch (provider) {
      case "google":
        returnResponse = this.fireauth.signInWithPopup(gp);
        break;
      case "facebook":
        returnResponse = this.fireauth.signInWithPopup(fp);
    }
    return returnResponse
  }


  signupByEailPassword(email: string, password: string): Promise<any> {
    const auth = getAuth(this.auths);
    return createUserWithEmailAndPassword(auth, email, password)

  }


  signup(body: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${env.base}${authEndpoints.signup}`, body, { headers })
  }

  getProfileData(token: string): Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${env.base}${authEndpoints.getProfile}`, { headers })
      .pipe(
        catchError(error => {
          // Handle errors here, e.g., log the error or throw a custom error
          console.error('Error fetching profile data:', error);
          throw error;
        })
      );

  }
  loginbyApi() {
    return this.http.post(`${env.base}${authEndpoints.loginbyApi}`, {})
  }
  logout() {
    this.fireauth.signOut();
    localStorage.removeItem('authToken')
    localStorage.removeItem('proifleDetail')
    this.route.navigate(['/auth'])
  }


  async getToken() {
     
    this.afAuth.authState.subscribe(user => {
      if (user) {
        user.getIdToken().then(token => {
          return token
        }).catch(error => {
          console.error('Error getting ID token:', error);
        });
      }
    });
  }


}
