import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {

  sidebarCollapsed = false;
  activeSection = 'home';
  showAddUserForm = false;
  userDropdownOpen = false;

  addUserForm!: FormGroup;

  // OTP state
  otpSent = false;
  otpVerified = false;
  clientId = '';   // IMPORTANT

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  private initializeForm() {
    this.addUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      aadhaar: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
      aadhaarOtp: ['', [Validators.pattern('^[0-9]{6}$')]],
      role: ['user', Validators.required]
    });
  }

  /* ---------------- UI Actions ---------------- */

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setActiveSection(section: string) {
    this.activeSection = section;
    this.showAddUserForm = false;
    this.userDropdownOpen = false;
  }

  toggleUserDropdown() {
    this.userDropdownOpen = !this.userDropdownOpen;
    this.activeSection = 'users';
  }

  showAddUser() {
    this.showAddUserForm = true;
    this.activeSection = 'users';
    this.resetOtpState();
  }

  hideAddUser() {
    this.showAddUserForm = false;
    this.addUserForm.reset();
    this.resetOtpState();
  }

  /* ---------------- ADD USER ---------------- */

  onSubmitUser() {
    if (!this.otpVerified) {
      alert('Please verify Aadhaar before adding user');
      return;
    }

    if (this.addUserForm.invalid) {
      return;
    }

    console.log('User Added:', this.addUserForm.value);
    alert('User added successfully');

    this.hideAddUser();
  }

  /* ---------------- OTP FLOW ---------------- */

  sendOtp() {
    const aadhaar = this.addUserForm.get('aadhaar')?.value;

    if (!aadhaar || aadhaar.length !== 12) {
      alert('Enter valid 12-digit Aadhaar');
      return;
    }

    if (!this.validateAadhaar(aadhaar)) {
      alert('Invalid Aadhaar number');
      return;
    }

    this.authService.generateAadhaarOtp({ id_Number: aadhaar })
      .subscribe({
        next: (res: any) => {
          // backend returns text / mock response
          this.clientId = res?.client_id || 'DEV_CLIENT_ID';
          this.otpSent = true;
          this.otpVerified = false;
          alert('OTP sent successfully');
        },
        error: () => {
          alert('Failed to send OTP');
        }
      });
  }

verifyOtp() {
  // OTP verification logic here
  this.otpVerified = true;

  // Mark all controls as touched to update validation
  this.addUserForm.markAllAsTouched();

  // Optionally, enable the form if you had disabled fields
  Object.keys(this.addUserForm.controls).forEach(key => {
    this.addUserForm.controls[key].enable();
  });
}
listDropdownOpen = false;

toggleListDropdown() {
  this.listDropdownOpen = !this.listDropdownOpen;
  this.userDropdownOpen = false; // optional: Users dropdown band karne ke liye
}




  private resetOtpState() {
    this.otpSent = false;
    this.otpVerified = false;
    this.clientId = '';
    this.addUserForm.patchValue({ aadhaarOtp: '' });
  }

  /* ---------------- Aadhaar Validation ---------------- */

  private validateAadhaar(aadhaar: string): boolean {
    const d = [
      [0,1,2,3,4,5,6,7,8,9],
      [1,2,3,4,0,6,7,8,9,5],
      [2,3,4,0,1,7,8,9,5,6],
      [3,4,0,1,2,8,9,5,6,7],
      [4,0,1,2,3,9,5,6,7,8],
      [5,9,8,7,6,0,4,3,2,1],
      [6,5,9,8,7,1,0,4,3,2],
      [7,6,5,9,8,2,1,0,4,3],
      [8,7,6,5,9,3,2,1,0,4],
      [9,8,7,6,5,4,3,2,1,0]
    ];

    const p = [
      [0,1,2,3,4,5,6,7,8,9],
      [1,5,7,6,2,8,3,0,9,4],
      [5,8,0,3,7,9,6,1,4,2],
      [8,9,1,6,0,4,3,5,2,7],
      [9,4,5,3,1,2,6,8,7,0],
      [4,2,8,6,5,7,3,9,0,1],
      [2,7,9,3,8,0,6,4,1,5],
      [7,0,4,6,9,1,3,2,5,8]
    ];

    let c = 0;
    aadhaar.split('').reverse().map(Number).forEach((val, i) => {
      c = d[c][p[i % 8][val]];
    });

    return c === 0;
  }

  logout() {
    this.authService.logout();
  }
}
