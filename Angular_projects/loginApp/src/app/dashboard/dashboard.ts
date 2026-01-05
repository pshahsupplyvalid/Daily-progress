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
  addUserForm!: FormGroup;
  showAddUserForm = false;

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
      role: ['user', Validators.required]
    });
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setActiveSection(section: string) {
    this.activeSection = section;
    this.showAddUserForm = false;
  }

  showAddUser() {
    this.showAddUserForm = true;
    this.activeSection = 'users';
  }

  hideAddUser() {
    this.showAddUserForm = false;
  }

  onSubmitUser() {
    if (this.addUserForm.valid) {
      console.log('Adding user:', this.addUserForm.value);
      // Here you would call your API to add the user
      alert('User added successfully!');
      this.addUserForm.reset();
      this.showAddUserForm = false;
    } else {
      alert('Please fill all required fields correctly.');
    }
  }

  logout() {
    this.authService.logout();
  }
}
