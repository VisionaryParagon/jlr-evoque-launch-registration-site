import { NgModule } from '@angular/core';

// App modules
import { AppSharedModule } from '../app-shared.module';
import { AdminRoutingModule } from './admin-routing.module';

// Admin components
import { AdminComponent } from './admin.component';
import { LoginComponent } from './login/login.component';
import { RegistrantsComponent } from './registrants/registrants.component';
import { WavesComponent } from './waves/waves.component';
import { RetailersComponent } from './retailers/retailers.component';
import { EmployeesComponent } from './employees/employees.component';

// Modal components
import { RegistrantFormComponent } from './modals/registrant-form/registrant-form.component';
import { RegistrantDeleteComponent } from './modals/registrant-delete/registrant-delete.component';
import { WaveFormComponent } from './modals/wave-form/wave-form.component';
import { WaveDeleteComponent } from './modals/wave-delete/wave-delete.component';
import { RetailerFormComponent } from './modals/retailer-form/retailer-form.component';
import { RetailerDeleteComponent } from './modals/retailer-delete/retailer-delete.component';
import { EmployeeFormComponent } from './modals/employee-form/employee-form.component';
import { EmployeeDeleteComponent } from './modals/employee-delete/employee-delete.component';

// CSV components
import { RegistrantCsvComponent } from './csv/registrant-csv/registrant-csv.component';
import { WaveCsvComponent } from './csv/wave-csv/wave-csv.component';
import { RetailerCsvComponent } from './csv/retailer-csv/retailer-csv.component';
import { EmployeeCsvComponent } from './csv/employee-csv/employee-csv.component';

@NgModule({
  imports: [
    AppSharedModule,
    AdminRoutingModule
  ],
  declarations: [
    AdminComponent,
    LoginComponent,
    RegistrantsComponent,
    WavesComponent,
    RetailersComponent,
    EmployeesComponent,
    RegistrantFormComponent,
    RegistrantDeleteComponent,
    WaveFormComponent,
    WaveDeleteComponent,
    RetailerFormComponent,
    RetailerDeleteComponent,
    EmployeeFormComponent,
    EmployeeDeleteComponent,
    RegistrantCsvComponent,
    WaveCsvComponent,
    RetailerCsvComponent,
    EmployeeCsvComponent
  ],
  entryComponents: [
    RegistrantFormComponent,
    RegistrantDeleteComponent,
    WaveFormComponent,
    WaveDeleteComponent,
    RetailerFormComponent,
    RetailerDeleteComponent,
    EmployeeFormComponent,
    EmployeeDeleteComponent
  ]
})
export class AdminModule { }
