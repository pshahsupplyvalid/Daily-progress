import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { AuthGuard } from './auth.guard';
import { ProcurementComponent as Procurement } from './procurement/procurement';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },

  /* ✅ NEW LINE YOU ASKED FOR */
  { 
    path: 'procurement', 
    component: Procurement, 
    canActivate: [AuthGuard] 
  }
];
