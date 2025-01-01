import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import {
  getAuth, signInWithPopup, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signOut
} from 'firebase/auth';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { loginDto } from '../../../constant/models/login.dto';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  route = inject(Router)

  constructor(private authService: AuthService) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  loginReturn:loginDto|undefined
  login() {debugger
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password).then(x => {
        if(x){
          let token = x._tokenResponse.idToken
          localStorage.setItem("authToken", token)
          this.authService.getProfileData(token).subscribe({
            next: x => {
              console.log(x);
              this.loginReturn = x;
              localStorage.setItem("proifleDetail",JSON.stringify(this.loginReturn?.profile))
              this.route.navigate(['/'])

            },
            error: x => {
              console.log('error is',x)},
          })
          
        }
        
        debugger
        
        
      })
      .catch(error => {
        console.error('Login failed:', error);
        // Handle login error (e.g., show an error message to the user)
      });
    }
  }

}