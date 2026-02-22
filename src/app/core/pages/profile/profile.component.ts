import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  loading = true;
  saving = false;
  userRole = '';
  private uid = '';

  profileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl({ value: '', disabled: true }),
    address: new FormControl(''),
    authMethod: new FormControl({ value: '', disabled: true }),
    role: new FormControl({ value: '', disabled: true }),
    createdAt: new FormControl({ value: '', disabled: true }),
    updatedAt: new FormControl({ value: '', disabled: true }),
  });

  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  private formatDate(value: any): string {
    if (!value) return '';
    try {
      if (value.toDate) return value.toDate().toLocaleDateString();
      if (value.seconds) return new Date(value.seconds * 1000).toLocaleDateString();
      return new Date(value).toLocaleDateString();
    } catch {
      return '';
    }
  }

  loadProfile() {
    const profile = JSON.parse(localStorage.getItem('proifleDetail') || '{}');
    this.uid = profile?.uid || profile?.id || '';

    if (this.uid) {
      this.authService.getUserProfile(this.uid).subscribe({
        next: (data) => {
          this.loading = false;
          if (data) {
            this.userRole = data.role || '';
            this.profileForm.patchValue({
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              email: data.email || '',
              address: data.address || '',
              authMethod: data.authMethod || '',
              role: data.role || '',
              createdAt: this.formatDate(data.createdAt),
              updatedAt: this.formatDate(data.updatedAt),
            });
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Profile load error:', err);
          this.toastr.error('Failed to load profile', 'Error');
        }
      });
    } else {
      this.loading = false;
    }
  }

  onSave() {
    if (this.profileForm.invalid || !this.uid) return;
    this.saving = true;

    const changes = {
      firstName: this.profileForm.get('firstName')?.value,
      lastName: this.profileForm.get('lastName')?.value,
      address: this.profileForm.get('address')?.value || '',
      updatedAt: new Date().toISOString(),
    };

    this.authService.updateUserProfile(this.uid, changes).subscribe({
      next: () => {
        this.saving = false;
        this.toastr.success('Profile updated successfully', 'Success');
        // Update localStorage so topbar reflects changes
        const stored = JSON.parse(localStorage.getItem('proifleDetail') || '{}');
        localStorage.setItem('proifleDetail', JSON.stringify({ ...stored, ...changes }));
      },
      error: () => {
        this.saving = false;
        this.toastr.error('Failed to update profile', 'Error');
      }
    });
  }
}
