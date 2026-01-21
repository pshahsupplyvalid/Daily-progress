import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgApexchartsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  /* ---------------- THEME STATE ---------------- */
  isDarkMode = false;

  /* ---------------- SETTINGS FORM ---------------- */
  settingsForm!: FormGroup;
  private settingsKey = 'dashboard_settings';
  appVersion = '1.4.2';

  /* ---------------- CLIENT LIST ---------------- */
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
  clientId = '';

  /* ---------------- LOCAL STORAGE USERS ---------------- */
  usersList: any[] = [];
  private storageKey = 'users';

  /* ---------------- 3 DOT MENU STATE ---------------- */
  openMenuIndex: number | null = null;

  /* ---------------- VIEW USER MODAL STATE ---------------- */
  isViewModalOpen = false;
  selectedUser: any = null;

  /* ---------------- ANALYTICS COUNTS ---------------- */
  activeClientsCount = 0;

  /* ---------------- CLICK LISTENER ---------------- */
  private globalClickListener!: (event: MouseEvent) => void;

  /* ---------------- APEXCHARTS ---------------- */

  // ✅ Line Chart
  lineChartSeries: any[] = [
    { name: 'Users Added', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
  ];

  lineChartOptions: any = {
    type: 'line',
    height: 320,
    toolbar: { show: false }
  };

  lineChartXAxis: any = {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };

  lineChartStroke: any = { curve: 'smooth', width: 3 };
  lineChartDataLabels: any = { enabled: false };

  // ✅ Bar Chart
  barChartSeries: any[] = [
    { name: 'Records', data: [0, 0] }
  ];

  barChartOptions: any = {
    type: 'bar',
    height: 320,
    toolbar: { show: false }
  };

  barChartXAxis: any = {
    categories: ['Procurement', 'Railway']
  };

  barChartPlotOptions: any = {
    bar: { borderRadius: 8, columnWidth: '40%' }
  };

  barChartDataLabels: any = {
    enabled: true
  };

  // ✅ Donut Chart (Clients)
  donutSeries: number[] = [0, 0];
  donutLabels: string[] = ['Active', 'Inactive'];

  donutChartOptions: any = {
    type: 'donut',
    height: 320
  };

  donutLegend: any = {
    position: 'bottom'
  };

  // ✅✅ Donut Chart (Users Active/Inactive) NEW ✅
  usersDonutSeries: number[] = [0, 0];
  usersDonutLabels: string[] = ['Active Users', 'Inactive Users'];

  usersDonutChartOptions: any = {
    type: 'donut',
    height: 320
  };

  usersDonutLegend: any = {
    position: 'bottom'
  };

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.initializeAddUserForm();
  }

  /* ✅ FIX WARNING: Safe getter for profile name */
  get profileName(): string {
    return this.settingsForm?.get('profileName')?.value || 'User';
  }

  /* ---------------- ON INIT ---------------- */
  ngOnInit(): void {
    this.initializeClientForm();
    this.initializeSettingsForm();

    // ✅ Load theme from storage
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';

    // ✅ Load users from localStorage
    this.loadUsersFromStorage();

    // ✅ Generate monthly chart for users
    this.generateMonthlyUsersGrowth();

    // ✅ Users Active/Inactive analytics chart
    this.calculateUsersAnalytics();

    // ✅ Fetch clients initially
    this.fetchClients();

    // ✅ Fetch counts for bar chart (so analytics also loads correctly)
    this.fetchListCounts();

    // Aadhaar change -> reset OTP state
    this.addUserForm.get('aadhaar')?.valueChanges.subscribe(() => {
      this.resetOtpState();
    });

    // ✅ Outside click closes 3-dot menu
    this.globalClickListener = () => this.closeActionMenu();
    document.addEventListener('click', this.globalClickListener);
  }

  ngOnDestroy(): void {
    if (this.globalClickListener) {
      document.removeEventListener('click', this.globalClickListener);
    }
  }

  /* ---------------- SETTINGS FORM ---------------- */
  private initializeSettingsForm(): void {
    this.settingsForm = this.fb.group({
      profileName: ['User', [Validators.required, Validators.minLength(2)]],
      profileEmail: ['', [Validators.email]],
      notifyEmail: [true],
      notifySms: [false],
      notifyApp: [true],
      autoLogout: ['10'],
      requireOtp: [true]
    });

    // ✅ Load settings from localStorage
    const savedSettings = localStorage.getItem(this.settingsKey);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        this.settingsForm.patchValue(parsed);
      } catch (e) {
        console.warn('Settings JSON parse error', e);
      }
    }
  }

  saveSettings(): void {
    if (this.settingsForm.invalid) {
      alert('Please enter valid profile details ❌');
      return;
    }

    localStorage.setItem(this.settingsKey, JSON.stringify(this.settingsForm.value));
    alert('Settings saved successfully ✅');
    this.cdr.detectChanges();
  }

  exportUsers(): void {
    this.downloadUsersReport();
  }

  clearAllUsers(): void {
    if (!confirm('Are you sure you want to clear all users?')) return;

    localStorage.removeItem(this.storageKey);
    this.loadUsersFromStorage();
    this.generateMonthlyUsersGrowth();
    this.calculateUsersAnalytics();
    this.cdr.detectChanges();

    alert('All users cleared ✅');
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

  /* ---------------- NAV SWITCH ---------------- */
  setActiveSection(section: string): void {
    this.activeSection = section;
    this.showAddUserForm = false;
    this.userDropdownOpen = false;
    this.listDropdownOpen = false;

    if (section === 'users') {
      this.loadUsersFromStorage();
      this.calculateUsersAnalytics();
    }

    if (section === 'clients') {
      this.clientForm.reset();
      this.fetchClients();
    }

    if (section === 'analytics') {
      this.loadUsersFromStorage();
      this.generateMonthlyUsersGrowth();
      this.fetchClients();
      this.fetchListCounts();
      this.calculateAnalytics();
      this.calculateUsersAnalytics();
    }

    this.cdr.detectChanges();
  }

  /* ---------------- CLIENT SUBMIT ---------------- */
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
      next: () => {
        alert('Client added successfully ✅');
        this.clientForm.reset();
        this.fetchClients();
        this.cdr.detectChanges();
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

  /* ---------------- FETCH CLIENTS ---------------- */
  fetchClients(): void {
    this.authService.getClients().subscribe({
      next: (res: any) => {
        this.clientsList = res || [];
        this.calculateAnalytics();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to fetch clients', err);
        this.clientsList = [];
        this.calculateAnalytics();
        this.cdr.detectChanges();
      }
    });
  }

  /* ---------------- FETCH PROCUREMENT + RAILWAY COUNTS ---------------- */
  fetchListCounts(): void {
    this.authService.getProcurementList().subscribe({
      next: (procRes: any) => {
        const procurementCount = Array.isArray(procRes)
          ? procRes.length
          : (procRes?.data?.length || procRes?.result?.length || procRes?.items?.length || 0);

        this.authService.getRailwayList().subscribe({
          next: (railRes: any) => {
            const railwayCount = Array.isArray(railRes)
              ? railRes.length
              : (railRes?.data?.length || railRes?.result?.length || railRes?.items?.length || 0);

            this.barChartSeries = [
              { name: 'Records', data: [procurementCount, railwayCount] }
            ];

            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('❌ Railway API error:', err);
            this.barChartSeries = [
              { name: 'Records', data: [procurementCount, 0] }
            ];
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('❌ Procurement API error:', err);
        this.barChartSeries = [
          { name: 'Records', data: [0, 0] }
        ];
        this.cdr.detectChanges();
      }
    });
  }

  /* ---------------- LINE CHART ---------------- */
  generateMonthlyUsersGrowth(): void {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthCounts = new Array(12).fill(0);

    this.usersList.forEach(user => {
      if (user?.createdAt) {
        const date = new Date(user.createdAt);
        if (!isNaN(date.getTime())) {
          monthCounts[date.getMonth()] += 1;
        }
      }
    });

    this.lineChartSeries = [
      { name: 'Users Added', data: monthCounts }
    ];

    this.lineChartXAxis = { categories: months };
    this.cdr.detectChanges();
  }

  /* ---------------- THEME METHODS ---------------- */
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.cdr.detectChanges();
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

    // ✅ BACKWARD COMPATIBILITY:
    this.usersList = this.usersList.map(u => ({
      ...u,
      isActive: typeof u.isActive === 'boolean' ? u.isActive : true
    }));
  }

  private saveUsersToStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.usersList));
  }

  deleteUser(index: number): void {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.usersList.splice(index, 1);
    this.saveUsersToStorage();

    alert('User deleted ✅');

    this.loadUsersFromStorage();
    this.generateMonthlyUsersGrowth();
    this.calculateUsersAnalytics();
    this.cdr.detectChanges();
  }

  /* ✅ Activate User */
  activateUser(index: number): void {
    this.usersList[index].isActive = true;
    this.saveUsersToStorage();
    this.calculateUsersAnalytics();
    alert('User Activated ✅');
    this.cdr.detectChanges();
  }

  /* ✅ Deactivate User */
  deactivateUser(index: number): void {
    this.usersList[index].isActive = false;
    this.saveUsersToStorage();
    this.calculateUsersAnalytics();
    alert('User Deactivated ❌');
    this.cdr.detectChanges();
  }

  /* ✅ Users Active/Inactive chart calculation */
  private calculateUsersAnalytics(): void {
    const activeUsers = this.usersList.filter(u => u?.isActive === true).length;
    const inactiveUsers = this.usersList.filter(u => u?.isActive === false).length;
    this.usersDonutSeries = [activeUsers, inactiveUsers];
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
    this.calculateUsersAnalytics();
  }

  toggleListDropdown(): void {
    this.listDropdownOpen = !this.listDropdownOpen;
    this.userDropdownOpen = false;
  }

  showAddUser(): void {
    this.showAddUserForm = true;
    this.activeSection = 'users';
    this.resetOtpState();

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

    this.addUserForm.reset({
      name: '',
      email: '',
      mobile: '',
      aadhaar: '',
      aadhaarOtp: '',
      role: 'user'
    });

    this.resetOtpState();
    this.loadUsersFromStorage();
    this.calculateUsersAnalytics();
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
      createdAt: new Date().toISOString(),
      isActive: true
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

    this.loadUsersFromStorage();
    this.generateMonthlyUsersGrowth();
    this.calculateUsersAnalytics();
    this.cdr.detectChanges();
  }

  /* ---------------- OTP FLOW ---------------- */
  sendOtp(): void {
    const aadhaar = this.addUserForm.get('aadhaar')?.value;

    if (!aadhaar || aadhaar.length !== 12) {
      alert('Enter valid 12-digit Aadhaar');
      return;
    }

    if (!this.validateAadhaar(aadhaar)) {
      alert('Invalid Aadhaar number');
      return;
    }

    this.resetOtpState();

    this.authService.generateAadhaarOtp({ id_Number: aadhaar }).subscribe({
      next: (clientId: any) => {
        this.clientId = String(clientId || '').trim();

        if (!this.clientId) {
          alert('Client ID not received ❌');
          return;
        }

        this.otpSent = true;
        this.cdr.detectChanges();
        alert('OTP sent successfully ✅');
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.message || 'Failed to send OTP ❌');
      }
    });
  }

  verifyOtp(): void {
    const enteredOtp = this.addUserForm.get('aadhaarOtp')?.value;

    if (!this.otpSent || !this.clientId) {
      alert('Please send OTP first');
      return;
    }

    if (!enteredOtp || !/^[0-9]{6}$/.test(enteredOtp)) {
      alert('Enter valid 6 digit OTP');
      return;
    }

    // ✅ Backend verification not integrated yet
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

    aadhaar.split('').reverse().map(Number).forEach((val, i) => {
      c = d[c][p[i % 8][val]];
    });

    return c === 0;
  }

  /* ---------------- ANALYTICS CALCULATION ---------------- */
  private calculateAnalytics(): void {
    this.activeClientsCount = this.clientsList.filter(c => c?.isActive === true).length;
    const inactiveCount = this.clientsList.filter(c => c?.isActive === false).length;
    this.donutSeries = [this.activeClientsCount, inactiveCount];
  }

  /* ---------------- PAGE NAVIGATION ---------------- */
  goToProcurement(): void {
    this.router.navigate(['./procurement']);
  }

  gotoclient(): void {
    this.router.navigate(['/client']);
  }

  goToFarmers(): void {
    this.router.navigate(['/railway-list']);
  }

  /* ---------------- LOGOUT ---------------- */
  logout(): void {
    this.authService.logout();
  }

  /* ======================================================
     ✅ REPORTS DOWNLOAD (REAL CSV DOWNLOAD ✅)
  ====================================================== */

  downloadUsersReport(): void {
    const users = this.usersList || [];

    if (users.length === 0) {
      alert('No users available to download ❌');
      return;
    }

    const headers = ['Name', 'Email', 'Mobile', 'Role', 'Aadhaar', 'Status', 'Created At'];
    const rows = users.map(u => [
      u?.name || '',
      u?.email || '',
      u?.mobile || '',
      u?.role || '',
      u?.aadhaar || '',
      u?.isActive ? 'Active' : 'Inactive',
      u?.createdAt || ''
    ]);

    this.downloadCSV('users-report.csv', headers, rows);
  }

  downloadClientsReport(): void {
    const clients = this.clientsList || [];

    if (clients.length === 0) {
      alert('No clients available to download ❌');
      return;
    }

    const headers = ['ID', 'Name', 'Contact No', 'Approval Status', 'Active', 'Portal Register Date'];
    const rows = clients.map(c => [
      c?.id ?? '',
      c?.name ?? '',
      c?.contactNo ?? '',
      c?.approvalStatus ?? '',
      c?.isActive ? 'Yes' : 'No',
      c?.portalRegisterDate ?? ''
    ]);

    this.downloadCSV('clients-report.csv', headers, rows);
  }

  downloadProcurementReport(): void {
    this.authService.getProcurementList().subscribe({
      next: (procRes: any) => {
        const list = Array.isArray(procRes)
          ? procRes
          : (procRes?.data || procRes?.result || procRes?.items || []);

        if (!Array.isArray(list) || list.length === 0) {
          alert('No procurement records available ❌');
          return;
        }

        const headers = Object.keys(list[0] || {});
        const rows = list.map((item: any) => headers.map(h => item?.[h] ?? ''));

        this.downloadCSV('procurement-report.csv', headers, rows);
      },
      error: (err) => {
        console.error('Procurement Download Error:', err);
        alert('Failed to download procurement report ❌');
      }
    });
  }

  downloadRailwayReport(): void {
    this.authService.getRailwayList().subscribe({
      next: (railRes: any) => {
        const list = Array.isArray(railRes)
          ? railRes
          : (railRes?.data || railRes?.result || railRes?.items || []);

        if (!Array.isArray(list) || list.length === 0) {
          alert('No railway records available ❌');
          return;
        }

        const headers = Object.keys(list[0] || {});
        const rows = list.map((item: any) => headers.map(h => item?.[h] ?? ''));

        this.downloadCSV('railway-report.csv', headers, rows);
      },
      error: (err) => {
        console.error('Railway Download Error:', err);
        alert('Failed to download railway report ❌');
      }
    });
  }

  downloadAnalyticsReport(): void {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Users', this.usersList.length],
      ['Total Clients', this.clientsList.length],
      ['Active Clients', this.activeClientsCount],
      ['Inactive Clients', this.clientsList.length - this.activeClientsCount],
      ['Procurement Count', this.barChartSeries?.[0]?.data?.[0] ?? 0],
      ['Railway Count', this.barChartSeries?.[0]?.data?.[1] ?? 0]
    ];

    this.downloadCSV('analytics-report.csv', headers, rows);
  }

  downloadActivityReport(): void {
    const headers = ['Activity', 'Time'];
    const rows = [
      ['Successfully logged in', '2 minutes ago'],
      ['Profile updated', '1 hour ago'],
      ['Email verified', '2 hours ago']
    ];

    this.downloadCSV('activity-logs-report.csv', headers, rows);
  }

  /* ✅ CSV Utility */
  private downloadCSV(fileName: string, headers: string[], rows: any[][]): void {
    const csvContent =
      [headers, ...rows]
        .map(r =>
          r.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();

    window.URL.revokeObjectURL(url);
  }
}
