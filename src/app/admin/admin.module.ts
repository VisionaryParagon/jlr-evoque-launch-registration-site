import { NgModule } from '@angular/core';

// App modules
import { AppSharedModule } from '../app-shared.module';
import { AdminRoutingModule } from './admin-routing.module';

// Admin components
import { AdminComponent } from './admin.component';
import { LoginComponent } from './login/login.component';
import { RegistrantsComponent } from './registrants/registrants.component';
import { WavesComponent } from './waves/waves.component';

// Admin components

@NgModule({
  imports: [
    AppSharedModule,
    AdminRoutingModule
  ],
  declarations: [
    AdminComponent,
    LoginComponent,
    RegistrantsComponent,
    WavesComponent
  ]
})
export class AdminModule { }
