import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  loginForm!: FormGroup;
  forgotForm!: FormGroup;

  loading = false;
  errorMsg = '';

  showPassword = false;
  isForgotPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      MobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', Validators.required]
    });

    this.forgotForm = this.fb.group({
      MobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  showForgotPassword(): void {
    this.isForgotPassword = true;
    this.errorMsg = '';
  }

  backToLogin(): void {
    this.isForgotPassword = false;
    this.errorMsg = '';
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.loading) return;

    this.loading = true;
    this.errorMsg = '';

    this.authService.login(this.loginForm.value)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res: any) => {
          // If login successful, navigate to dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          this.errorMsg = error.message || 'Invalid mobile number or password';
        }
      });
  }

  onForgotSubmit(): void {
    if (this.forgotForm.invalid) {
      this.errorMsg = 'Please enter a valid mobile number';
      return;
    }

    alert('Password reset link / OTP sent to your mobile');
    this.backToLogin();
  }
}
