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

// CSV components
import { RegistrantCsvComponent } from './csv/registrant-csv/registrant-csv.component';
import { WaveCsvComponent } from './csv/wave-csv/wave-csv.component';

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
    WaveCsvComponent
  ],
  entryComponents: [
    RegistrantFormComponent,
    RegistrantDeleteComponent,
    WaveFormComponent,
    WaveDeleteComponent
  ]
})
export class AdminModule { }
