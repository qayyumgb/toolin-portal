import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  route = inject(Router);
  loging: boolean = false;

  constructor(private authService: AuthService, private toastr: ToastrService) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  async login() {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      this.loging = true;

      let result;
      try {
        result = await this.authService.login(this.loginForm.value.email, this.loginForm.value.password);
      } catch (error: any) {
        const code = error?.code || '';
        if (code === 'auth/user-not-found') {
          this.toastr.error('No account found with this email', 'Error');
        } else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
          this.toastr.error('Invalid email or password', 'Error');
        } else if (code === 'auth/too-many-requests') {
          this.toastr.error('Too many attempts. Please try again later.', 'Error');
        } else {
          this.toastr.error(error?.message || 'Login failed', 'Error');
        }
        this.loging = false;
        return;
      }

      if (result?.user) {
        const token = await result.user.getIdToken();
        const uid = result.user.uid;

        this.authService.getUserProfile(uid).subscribe({
          next: (profile) => {
            this.loging = false;
            if (!profile || (profile.role !== 'Provider' && profile.role !== 'Admin')) {
              this.authService.logout();
              this.toastr.error('Only sellers and admins can access the portal. Please switch to "Become a Seller" on the website first.', 'Access Denied');
              return;
            }
            localStorage.setItem('authToken', token);
            localStorage.setItem('proifleDetail', JSON.stringify(profile));
            this.route.navigate(['/']);
          },
          error: (err) => {
            console.error('getUserProfile error:', err);
            this.loging = false;
            this.authService.logout();
            this.toastr.error('Failed to load profile: ' + (err?.message || err?.code || 'Unknown error'), 'Error');
          }
        });
      }
    }
  }
}
