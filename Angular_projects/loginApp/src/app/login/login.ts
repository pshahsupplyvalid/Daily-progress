import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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

  /* ---------------- AADHAAR LOGIN ---------------- */
  showAadhaarModal = false;
  aadhaarNumber = '';
  aadhaarOtp = '';
  otpSent = false;

  // ✅ Store client_id from generate OTP response
  aadhaarClientId = '';

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

  /* ---------------- CAPTCHA ---------------- */
  generateCaptcha(): void {
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

  /* ---------------- NORMAL LOGIN ---------------- */
  onSubmit(): void {
    if (this.loginForm.invalid || this.loading) return;

    // captcha validation
    if (this.loginForm.value.captcha !== this.captchaText) {
      this.captchaInvalid = true;
      this.generateCaptcha();
      return;
    }

    this.captchaInvalid = false;
    this.loading = true;
    this.errorMsg = '';

    const payload = {
      MobileNo: this.loginForm.value.MobileNo,
      password: this.loginForm.value.password
    };

    this.authService.login(payload)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          this.errorMsg =
            error?.error?.message ||
            error?.message ||
            'Invalid mobile number or password';

          this.generateCaptcha();
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

  /* ---------------- AADHAAR MODAL ---------------- */
  openAadhaarModal(): void {
    this.showAadhaarModal = true;

    // ✅ Reset Aadhaar login states
    this.otpSent = false;
    this.aadhaarNumber = '';
    this.aadhaarOtp = '';
    this.aadhaarClientId = '';
    this.errorMsg = '';

    document.body.style.overflow = 'hidden';
  }

  closeAadhaarModal(): void {
    this.showAadhaarModal = false;

    // ✅ Reset Aadhaar login states
    this.otpSent = false;
    this.aadhaarNumber = '';
    this.aadhaarOtp = '';
    this.aadhaarClientId = '';

    document.body.style.overflow = 'auto';
  }

  /* ---------------- AADHAAR OTP ---------------- */

  sendAadhaarOtp(): void {
    if (!/^[0-9]{12}$/.test(this.aadhaarNumber)) {
      alert('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    // ✅ prevent double click
    if (this.loading) return;

    this.loading = true;

    // ✅ OTP field open immediately (no need 2 clicks)
    this.otpSent = true;

    this.authService.generateAadhaarOtp({ id_Number: this.aadhaarNumber })
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (clientId: string) => {
          this.aadhaarClientId = clientId;

          console.log('✅ Aadhaar Client ID:', this.aadhaarClientId);
          alert('OTP Sent Successfully ✅');
        },
        error: (err: any) => {
          console.error(err);

          // ❌ hide OTP field if send OTP fails
          this.otpSent = false;

          alert(err?.error?.message || 'Failed to send OTP ❌');
        }
      });
  }

  verifyAadhaarOtp(): void {

    if (!this.otpSent) {
      alert('Please click "Send OTP" first.');
      return;
    }

    if (!this.aadhaarClientId) {
      alert('Client ID missing. Please click "Send OTP" again.');
      return;
    }

    if (!/^[0-9]{6}$/.test(this.aadhaarOtp)) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    // ✅ prevent double click
    if (this.loading) return;

    this.loading = true;

    this.authService.verifyAadhaarOtp({
      otp: this.aadhaarOtp,
      client_id: this.aadhaarClientId
    })
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res: any) => {
          console.log('✅ Aadhaar Verify Response:', res);

          // ✅ IMPORTANT: Token set for AuthGuard
          // If backend sends token -> store it
          if (res?.token) {
            this.authService.setToken(res.token);
          } else {
            // ✅ TEMP DEV token (remove later)
            localStorage.setItem('token', 'aadhaar-temp-token');
          }

          alert('Aadhaar login successful ✅');

          // ✅ Close modal then navigate
          this.closeAadhaarModal();

          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          console.error(err);
          alert(err?.error?.message || err?.message || 'Invalid OTP ❌');
        }
      });
  }
}
