import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { ProcurementComponent } from './procurement/procurement';
import { AuthGuard } from './auth.guard';
import { RailwayListComponent } from './railway-list/railway-list';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'procurement',
    component: ProcurementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'railway-list',
    component: RailwayListComponent,
    canActivate: [AuthGuard]
  }
];
