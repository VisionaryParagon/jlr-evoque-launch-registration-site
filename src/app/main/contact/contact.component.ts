import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie';

import { Registrant, Contact } from '../../services/classes';
import { RegistrationService } from '../../services/registration.service';
import { EmailService } from '../../services/email.service';

import { FadeAnimation, TopDownAnimation } from '../../animations';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  animations: [ FadeAnimation, TopDownAnimation ]
})
export class ContactComponent implements OnInit {
  registrant: Registrant = this.regService.getCurrentRegistrant();
  regId: string = this.cookieService.get('regId');
  contact: Contact = new Contact();
  submitted = false;
  loading = false;
  success = false;
  error = false;

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private regService: RegistrationService,
    private emailService: EmailService
  ) { }

  ngOnInit() {
    if (this.regId && !this.registrant.jlr_id) {
      this.registrant.jlr_id = this.regId;
      this.regService.loginRegistrant(this.registrant)
        .subscribe(
          res => {
            if (res.message === 'Success') {
              // store registrant data
              this.regService.setCurrentRegistrant(res);
              this.registrant = this.regService.getCurrentRegistrant();
              this.setContact(this.registrant);
            } else {
              // clear cookies
              this.cookieService.remove('regId');

              // clear stored registrant
              this.regService.clearCurrentRegistrant();

              // redirect to login page
              this.router.navigate(['/login']);
            }
          },
          err => {
            // clear cookies
            this.cookieService.remove('regId');

            // clear stored registrant
            this.regService.clearCurrentRegistrant();

            // redirect to login page
            this.router.navigate(['/login']);
          }
        );
    } else {
      this.setContact(this.registrant);
    }
  }

  setContact(data) {
    for (const prop in data) {
      if (data.hasOwnProperty(prop) && this.contact.hasOwnProperty(prop)) {
        this.contact[prop] = data[prop];
      }
    }
  }

  submit(data, isValid) {
    this.submitted = true;

    if (isValid) {
      this.loading = true;

      this.emailService.sendContact(data)
        .subscribe(
          res => {
            this.success = true;
            this.loading = false;
          },
          err => this.showError()
        );
    }
  }

  showError() {
    this.error = true;
  }

  hideError() {
    this.error = false;
  }
}
