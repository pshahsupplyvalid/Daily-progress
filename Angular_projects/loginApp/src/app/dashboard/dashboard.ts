import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  /* ---------------- THEME STATE ---------------- */
  isDarkMode = false;

  /* ---------------- SIDEBAR / UI STATE ---------------- */
  sidebarCollapsed = false;
  activeSection = 'home';

  userDropdownOpen = false;
  listDropdownOpen = false;

  showAddUserForm = false;

  /* ---------------- FORM ---------------- */
  addUserForm!: FormGroup;

  /* ---------------- OTP STATE ---------------- */
  otpSent = false;
  otpVerified = false;

  // ✅ API se jo client_id milega wo yaha store hoga
  clientId = '';

  /* ---------------- LOCAL STORAGE USERS ---------------- */
  usersList: any[] = [];
  private storageKey = 'users';

  /* ---------------- 3 DOT MENU STATE ---------------- */
  openMenuIndex: number | null = null;

  /* ---------------- VIEW USER MODAL STATE ---------------- */
  isViewModalOpen = false;
  selectedUser: any = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  /* ---------------- ON INIT ---------------- */
  ngOnInit(): void {
    // ✅ Theme load
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();

    // ✅ Load users from storage
    this.loadUsersFromStorage();

    // ✅ Aadhaar change -> Reset OTP state automatically
    this.addUserForm.get('aadhaar')?.valueChanges.subscribe(() => {
      this.otpSent = false;
      this.otpVerified = false;
      this.clientId = '';

      // reset otp input field
      this.addUserForm.patchValue({ aadhaarOtp: '' }, { emitEvent: false });
    });

    // ✅ Outside click -> close 3 dot menu
    document.addEventListener('click', () => {
      this.closeActionMenu();
    });
  }

  /* ---------------- THEME METHODS ---------------- */
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  /* ---------------- FORM INIT ---------------- */
  private initializeForm(): void {
    this.addUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      aadhaar: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
      aadhaarOtp: ['', [Validators.pattern('^[0-9]{6}$')]],
      role: ['user', Validators.required]
    });
  }

  /* ---------------- LOCAL STORAGE METHODS ---------------- */
  private loadUsersFromStorage(): void {
    const data = localStorage.getItem(this.storageKey);
    this.usersList = data ? JSON.parse(data) : [];
  }

  private saveUsersToStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.usersList));
  }

  deleteUser(index: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    this.usersList.splice(index, 1);
    this.saveUsersToStorage();
    alert('User deleted ✅');
  }

  /* ---------------- 3 DOT MENU METHODS ---------------- */
  toggleActionMenu(index: number, event: Event): void {
    event.stopPropagation(); // ✅ so outside click doesn't close immediately
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }

  closeActionMenu(): void {
    this.openMenuIndex = null;
  }

  /* ---------------- VIEW MODAL METHODS ---------------- */
  viewUser(user: any): void {
    this.selectedUser = user;
    this.isViewModalOpen = true;
  }

  closeViewModal(): void {
    this.isViewModalOpen = false;
    this.selectedUser = null;
  }

  /* ---------------- UI ACTIONS ---------------- */
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
    this.showAddUserForm = false;
    this.userDropdownOpen = false;
    this.listDropdownOpen = false;

    // ✅ Always refresh users list when opening users section
    if (section === 'users') {
      this.loadUsersFromStorage();
    }
  }

  toggleUserDropdown(): void {
    this.userDropdownOpen = !this.userDropdownOpen;
    this.listDropdownOpen = false;
    this.activeSection = 'users';

    // ✅ Refresh list every time user dropdown opens
    this.loadUsersFromStorage();
  }

  toggleListDropdown(): void {
    this.listDropdownOpen = !this.listDropdownOpen;
    this.userDropdownOpen = false;
  }

  showAddUser(): void {
    this.showAddUserForm = true;
    this.activeSection = 'users';
    this.resetOtpState();

    // ✅ Clean form when opening add user
    this.addUserForm.reset({
      name: '',
      email: '',
      mobile: '',
      aadhaar: '',
      aadhaarOtp: '',
      role: 'user'
    });
  }

  hideAddUser(): void {
    this.showAddUserForm = false;

    // ✅ Reset form properly (role should remain user)
    this.addUserForm.reset({
      name: '',
      email: '',
      mobile: '',
      aadhaar: '',
      aadhaarOtp: '',
      role: 'user'
    });

    this.resetOtpState();

    // ✅ Reload list again
    this.loadUsersFromStorage();
  }

  /* ---------------- ADD USER ---------------- */
  onSubmitUser(): void {
    if (!this.otpVerified) {
      alert('Please verify Aadhaar before adding user');
      return;
    }

    if (this.addUserForm.invalid) {
      alert('Please fill all required fields properly');
      return;
    }

    // ✅ Create New User Object
    const newUser = {
      name: this.addUserForm.value.name,
      email: this.addUserForm.value.email,
      mobile: this.addUserForm.value.mobile,
      aadhaar: this.addUserForm.value.aadhaar,
      role: this.addUserForm.value.role || 'user',
      createdAt: new Date().toISOString()
    };

    // ✅ Load old list again
    this.loadUsersFromStorage();

    // ✅ Duplicate check (email/mobile)
    const alreadyExists = this.usersList.some((u: any) =>
      u.email === newUser.email || u.mobile === newUser.mobile
    );

    if (alreadyExists) {
      alert('User already exists with same Email or Mobile ❌');
      return;
    }

    // ✅ Save user in LocalStorage
    this.usersList.push(newUser);
    this.saveUsersToStorage();

    console.log('✅ User Saved in LocalStorage:', newUser);
    alert('User added successfully ✅');

    // ✅ Close form and show list
    this.hideAddUser();
  }

  /* ---------------- OTP FLOW ---------------- */
  sendOtp(): void {
    const aadhaar = this.addUserForm.get('aadhaar')?.value;

    if (!aadhaar || aadhaar.length !== 12) {
      alert('Enter valid 12-digit Aadhaar');
      return;
    }

    // ✅ Verhoeff Aadhaar validation (optional)
    if (!this.validateAadhaar(aadhaar)) {
      alert('Invalid Aadhaar number');
      return;
    }

    // ✅ Reset before sending OTP
    this.otpSent = false;
    this.otpVerified = false;
    this.clientId = '';
    this.addUserForm.patchValue({ aadhaarOtp: '' });

    this.authService.generateAadhaarOtp({ id_Number: aadhaar })
      .subscribe({
        next: (clientId: any) => {
          // ✅ Your API returns plain text string
          this.clientId = String(clientId || '').trim();

          if (!this.clientId) {
            alert('Client ID not received from server ❌');
            return;
          }

          this.otpSent = true;
          this.otpVerified = false;

          console.log('✅ OTP Client ID:', this.clientId);
          alert('OTP sent successfully ✅');
        },
        error: (err: any) => {
          console.error('❌ OTP Send Error:', err);
          alert(err?.error?.message || err?.message || 'Failed to send OTP ❌');
        }
      });
  }

  verifyOtp(): void {
    const enteredOtp = this.addUserForm.get('aadhaarOtp')?.value;

    if (!this.otpSent) {
      alert('Please send OTP first');
      return;
    }

    if (!this.clientId) {
      alert('Client ID missing, send OTP again');
      return;
    }

    if (!enteredOtp || !/^[0-9]{6}$/.test(enteredOtp)) {
      alert('Please enter valid 6 digit OTP');
      return;
    }

    // ✅ NOTE: अभी backend verify OTP API नहीं लगाया गया यहाँ
    // अभी हम local verify mark कर रहे हैं
    this.otpVerified = true;
    this.addUserForm.markAllAsTouched();
    alert('OTP Verified ✅');
  }

  private resetOtpState(): void {
    this.otpSent = false;
    this.otpVerified = false;
    this.clientId = '';
    this.addUserForm.patchValue({ aadhaarOtp: '' }, { emitEvent: false });
  }

  /* ---------------- AADHAAR VALIDATION ---------------- */
  private validateAadhaar(aadhaar: string): boolean {
    const d = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
      [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
      [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
      [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
      [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
      [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
      [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
      [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
      [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ];

    const p = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
      [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
      [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
      [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
      [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
      [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
      [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ];

    let c = 0;
    aadhaar.split('').reverse().map(Number).forEach((val, i) => {
      c = d[c][p[i % 8][val]];
    });

    return c === 0;
  }

  /* ---------------- PAGE NAVIGATION ---------------- */
  goToProcurement(): void {
    this.router.navigate(['./procurement']);
  }

  goToFarmers(): void {
    this.router.navigate(['/railway-list']); // future ready
  }

  /* ---------------- LOGOUT ---------------- */
  logout(): void {
    this.authService.logout();
  }
}
