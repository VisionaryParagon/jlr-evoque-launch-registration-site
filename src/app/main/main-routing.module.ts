import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Guards
import { RegistrationGuardService } from '../services/registration-guard.service';

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

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [RegistrationGuardService],
    children: [
      {
        path: '',
        canActivateChild: [RegistrationGuardService],
        children: [
          {
            path: '',
            component: HomeComponent
          },
          {
            path: 'location',
            component: LocationComponent
          },
          {
            path: 'faqs',
            component: FaqComponent
          },
          {
            path: 'contact',
            component: ContactComponent
          },
          {
            path: 'register',
            component: RegisterComponent
          },
        ]
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
