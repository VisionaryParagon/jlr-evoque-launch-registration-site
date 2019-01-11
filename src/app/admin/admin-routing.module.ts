import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Admin Guards
import { AdminGuardService } from '../services/admin-guard.service';
import { AdminLoginGuardService } from '../services/admin-login-guard.service';

// Admin components
import { AdminComponent } from './admin.component';
import { LoginComponent } from './login/login.component';
import { RegistrantsComponent } from './registrants/registrants.component';
import { WavesComponent } from './waves/waves.component';
import { RetailersComponent } from './retailers/retailers.component';
import { EmployeesComponent } from './employees/employees.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: RegistrantsComponent,
        canActivate: [AdminGuardService]
      },
      {
        path: 'waves',
        component: WavesComponent,
        canActivate: [AdminGuardService]
      },
      {
        path: 'retailers',
        component: RetailersComponent,
        canActivate: [AdminGuardService]
      },
      {
        path: 'employees',
        component: EmployeesComponent,
        canActivate: [AdminGuardService]
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [AdminLoginGuardService]
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/admin'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
