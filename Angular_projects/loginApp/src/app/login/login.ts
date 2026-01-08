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

  /* ---------------- FORMS ---------------- */
  loginForm!: FormGroup;
  forgotForm!: FormGroup;

  /* ---------------- UI STATE ---------------- */
  loading = false;
  errorMsg = '';
  showPassword = false;
  isForgotPassword = false;

  /* ---------------- CAPTCHA ---------------- */
  captchaText = '';
  captchaInvalid = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    /* LOGIN FORM */
    this.loginForm = this.fb.group({
      MobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', Validators.required],
      captcha: ['', Validators.required]
    });

    /* FORGOT FORM */
    this.forgotForm = this.fb.group({
      MobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });

    this.generateCaptcha();
  }

  /* ---------------- CAPTCHA LOGIC ---------------- */

  generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    this.captchaText = '';
    for (let i = 0; i < 5; i++) {
      this.captchaText += chars.charAt(
        Math.floor(Math.random() * chars.length)
      );
    }
  }

  /* ---------------- PASSWORD ---------------- */

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /* ---------------- FORGOT PASSWORD ---------------- */

  showForgotPassword(): void {
    this.isForgotPassword = true;
    this.errorMsg = '';
  }

  backToLogin(): void {
    this.isForgotPassword = false;
    this.errorMsg = '';
  }

  /* ---------------- LOGIN SUBMIT ---------------- */

  onSubmit(): void {
    if (this.loginForm.invalid || this.loading) return;

    /* CAPTCHA VALIDATION */
    if (this.loginForm.value.captcha !== this.captchaText) {
      this.captchaInvalid = true;
      this.generateCaptcha();
      return;
    }

    this.captchaInvalid = false;
    this.loading = true;
    this.errorMsg = '';

    this.authService.login(this.loginForm.value)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          this.errorMsg = error?.message || 'Invalid mobile number or password';
          this.generateCaptcha(); // regenerate on failure
        }
      });
  }

  /* ---------------- FORGOT SUBMIT ---------------- */

  onForgotSubmit(): void {
    if (this.forgotForm.invalid) {
      this.errorMsg = 'Please enter a valid mobile number';
      return;
    }

    alert('Password reset link / OTP sent to your mobile');
    this.backToLogin();
  }
}
