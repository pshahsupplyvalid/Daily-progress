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
    styleUrls: ['./dashboard.css']
  })
  export class DashboardComponent implements OnInit {

    /* ---------------- THEME STATE ---------------- */
    isDarkMode = false;
  clientsList: any[] = [];

    /* ---------------- CLIENT FORM ---------------- */
    clientForm!: FormGroup;

    /* ---------------- SIDEBAR / UI STATE ---------------- */
    sidebarCollapsed = false;
    activeSection = 'home';

    userDropdownOpen = false;
    listDropdownOpen = false;

    showAddUserForm = false;

    /* ---------------- ADD USER FORM ---------------- */
    addUserForm!: FormGroup;

    /* ---------------- OTP STATE ---------------- */
    otpSent = false;
    otpVerified = false;
    clientId = ''; // API se jo client_id milega

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
      this.initializeAddUserForm();
    }

    /* ---------------- ON INIT ---------------- */
    ngOnInit(): void {
      this.initializeClientForm();

      // ✅ Load theme from storage
      const savedTheme = localStorage.getItem('theme');
      this.isDarkMode = savedTheme === 'dark';
      this.applyTheme();

      // ✅ Load users from localStorage
      this.loadUsersFromStorage();

      // Aadhaar change -> reset OTP state
      this.addUserForm.get('aadhaar')?.valueChanges.subscribe(() => {
        this.resetOtpState();
      });

      // Outside click closes 3-dot menu
      document.addEventListener('click', () => this.closeActionMenu());
    }

    /* ---------------- CLIENT FORM ---------------- */
    private initializeClientForm(): void {
      this.clientForm = this.fb.group({
        name: ['', Validators.required],
        contactNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        contactEmail: ['', Validators.email],
        gstin: [''],
        pan: [''],
        addrLine: [''],
        pincode: [''],
        stateId: [0],
        districtId: [0],
        subDistrictId: [0],
        cpName: [''],
        cpMobile: [''],
        cpEmail: ['', Validators.email]
      });
    }

  setActiveSection(section: string): void {
    this.activeSection = section;
    this.showAddUserForm = false;
    this.userDropdownOpen = false;
    this.listDropdownOpen = false;

    if (section === 'users') this.loadUsersFromStorage();
    if (section === 'clients') {
      this.clientForm.reset();
      this.fetchClients(); // fetch clients when clients section opens
    }
  }


    submitClient(): void {
      if (this.clientForm.invalid) {
        alert('Please fill required client fields ❌');
        return;
      }

      const f = this.clientForm.value;
      const formData = new FormData();
      formData.append('Name', f.name);
      formData.append('ContactNo', f.contactNo);
      formData.append('Contactemail', f.contactEmail || '');
      formData.append('GSTIN', f.gstin || '');
      formData.append('PAN', f.pan || '');
      formData.append('Address.AddrLine', f.addrLine || '');
      formData.append('Address.Pincode', f.pincode || '');
      formData.append('Address.StateId', String(f.stateId));
      formData.append('Address.DistrictId', String(f.districtId));
      formData.append('Address.SubDistrictId', String(f.subDistrictId));
      formData.append('ContactPerson.Name', f.cpName || '');
      formData.append('ContactPerson.Mobile', f.cpMobile || '');
      formData.append('ContactPerson.Email', f.cpEmail || '');

      this.authService.addClient(formData).subscribe({
        next: (res) => {
          alert('Client added successfully ✅');
          this.clientForm.reset();
        },
        error: (err) => {
          console.error('Client API Error:', err);
          alert(err?.error?.message || 'Failed to add client ❌');
        }
      });
    }

    resetClientForm(): void {
      this.clientForm.reset();
    }
  fetchClients(): void {
    this.authService.getClients().subscribe({
      next: (res: any) => {
        this.clientsList = res || [];
      },
      error: (err) => {
        console.error('Failed to fetch clients', err);
        this.clientsList = [];
      }
    });
  }

    /* ---------------- THEME METHODS ---------------- */
    toggleTheme(): void {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
      this.applyTheme();
    }

    private applyTheme(): void {
      document.body.classList.toggle('dark-mode', this.isDarkMode);
    }

    /* ---------------- ADD USER FORM ---------------- */
    private initializeAddUserForm(): void {
      this.addUserForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        aadhaar: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
        aadhaarOtp: ['', [Validators.pattern('^[0-9]{6}$')]],
        role: ['user', Validators.required]
      });
    }

    /* ---------------- LOCAL STORAGE USERS ---------------- */
    private loadUsersFromStorage(): void {
      const data = localStorage.getItem(this.storageKey);
      this.usersList = data ? JSON.parse(data) : [];
    }

    private saveUsersToStorage(): void {
      localStorage.setItem(this.storageKey, JSON.stringify(this.usersList));
    }

    deleteUser(index: number): void {
      if (!confirm('Are you sure you want to delete this user?')) return;
      this.usersList.splice(index, 1);
      this.saveUsersToStorage();
      alert('User deleted ✅');
    }

    /* ---------------- 3 DOT MENU ---------------- */
    toggleActionMenu(index: number, event: Event): void {
      event.stopPropagation();
      this.openMenuIndex = this.openMenuIndex === index ? null : index;
    }

    closeActionMenu(): void {
      this.openMenuIndex = null;
    }

    /* ---------------- VIEW MODAL ---------------- */
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

    toggleUserDropdown(): void {
      this.userDropdownOpen = !this.userDropdownOpen;
      this.listDropdownOpen = false;
      this.activeSection = 'users';
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
      this.addUserForm.reset({ name: '', email: '', mobile: '', aadhaar: '', aadhaarOtp: '', role: 'user' });
    }

    hideAddUser(): void {
      this.showAddUserForm = false;
      this.addUserForm.reset({ name: '', email: '', mobile: '', aadhaar: '', aadhaarOtp: '', role: 'user' });
      this.resetOtpState();
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

      const newUser = {
        name: this.addUserForm.value.name,
        email: this.addUserForm.value.email,
        mobile: this.addUserForm.value.mobile,
        aadhaar: this.addUserForm.value.aadhaar,
        role: this.addUserForm.value.role || 'user',
        createdAt: new Date().toISOString()
      };

      this.loadUsersFromStorage();

      if (this.usersList.some(u => u.email === newUser.email || u.mobile === newUser.mobile)) {
        alert('User already exists with same Email or Mobile ❌');
        return;
      }

      this.usersList.push(newUser);
      this.saveUsersToStorage();
      alert('User added successfully ✅');
      this.hideAddUser();
    }

    /* ---------------- OTP FLOW ---------------- */
    sendOtp(): void {
      const aadhaar = this.addUserForm.get('aadhaar')?.value;
      if (!aadhaar || aadhaar.length !== 12) { alert('Enter valid 12-digit Aadhaar'); return; }
      if (!this.validateAadhaar(aadhaar)) { alert('Invalid Aadhaar number'); return; }

      this.resetOtpState();
      this.authService.generateAadhaarOtp({ id_Number: aadhaar }).subscribe({
        next: (clientId: any) => {
          this.clientId = String(clientId || '').trim();
          if (!this.clientId) { alert('Client ID not received ❌'); return; }
          this.otpSent = true;
          alert('OTP sent successfully ✅');
        },
        error: (err) => { console.error(err); alert(err?.error?.message || 'Failed to send OTP ❌'); }
      });
    }

    verifyOtp(): void {
      const enteredOtp = this.addUserForm.get('aadhaarOtp')?.value;
      if (!this.otpSent || !this.clientId) { alert('Please send OTP first'); return; }
      if (!enteredOtp || !/^[0-9]{6}$/.test(enteredOtp)) { alert('Enter valid 6 digit OTP'); return; }

      // ✅ Backend not integrated yet
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

    private validateAadhaar(aadhaar: string): boolean {
      const d = [
        [0,1,2,3,4,5,6,7,8,9],[1,2,3,4,0,6,7,8,9,5],[2,3,4,0,1,7,8,9,5,6],
        [3,4,0,1,2,8,9,5,6,7],[4,0,1,2,3,9,5,6,7,8],[5,9,8,7,6,0,4,3,2,1],
        [6,5,9,8,7,1,0,4,3,2],[7,6,5,9,8,2,1,0,4,3],[8,7,6,5,9,3,2,1,0,4],
        [9,8,7,6,5,4,3,2,1,0]
      ];
      const p = [
        [0,1,2,3,4,5,6,7,8,9],[1,5,7,6,2,8,3,0,9,4],[5,8,0,3,7,9,6,1,4,2],
        [8,9,1,6,0,4,3,5,2,7],[9,4,5,3,1,2,6,8,7,0],[4,2,8,6,5,7,3,9,0,1],
        [2,7,9,3,8,0,6,4,1,5],[7,0,4,6,9,1,3,2,5,8]
      ];
      let c = 0;
      aadhaar.split('').reverse().map(Number).forEach((val,i)=>{c=d[c][p[i%8][val]];});
      return c===0;
    }

    /* ---------------- PAGE NAVIGATION ---------------- */
    goToProcurement(): void { this.router.navigate(['./procurement']); }
    gotoclient(): void { this.router.navigate(['/client']); }
    goToFarmers(): void { this.router.navigate(['/railway-list']); }

    /* ---------------- LOGOUT ---------------- */
    logout(): void { this.authService.logout(); }
  }
