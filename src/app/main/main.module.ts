import { NgModule } from '@angular/core';

// App modules
import { AppSharedModule } from '../app-shared.module';
import { MainRoutingModule } from './main-routing.module';

// Main
import { MainComponent } from './main.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

// Location
import { LocationComponent } from './location/location.component';

// FAQs
import { FaqComponent } from './faq/faq.component';

// Contact
import { ContactComponent } from './contact/contact.component';

// Contact
import { RegisterComponent } from './register/register.component';

@NgModule({
  imports: [
    AppSharedModule,
    MainRoutingModule
  ],
  declarations: [
    MainComponent,
    HomeComponent,
    LoginComponent,
    LocationComponent,
    FaqComponent,
    ContactComponent,
    RegisterComponent
  ]
})
export class MainModule { }
