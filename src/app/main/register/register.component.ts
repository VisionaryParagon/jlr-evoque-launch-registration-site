import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie';

import { Registrant, Retailer, Options } from '../../services/classes';
import { RegistrationService } from '../../services/registration.service';
import { EmailService } from '../../services/email.service';

import { FadeAnimation, TopDownAnimation } from '../../animations';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [ FadeAnimation, TopDownAnimation ]
})
export class RegisterComponent implements OnInit {
  registrant: Registrant = {...this.regService.getCurrentRegistrant()};
  regId: string = this.cookieService.get('regId');
  retailer: Retailer = this.regService.getCurrentRetailer();
  options: Options = new Options();
  waves: any[];
  formLoading = true;
  registered = false;
  full = false;
  anyVal;
  waveNote = 'insert dynamic note here...';
  regChecked = false;
  submitted = false;
  loading = false;
  success = false;
  invalid = false;
  error = false;
  err = '';

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private regService: RegistrationService,
    private emailService: EmailService
  ) { }

  ngOnInit() {
    this.getOptions();

    if (this.regId && !this.registrant.jlr_id) {
      this.registrant.jlr_id = this.regId;
      this.regService.loginRegistrant(this.registrant)
        .subscribe(
          res => {
            if (res.message === 'Success') {
              // store registrant data
              this.regService.setCurrentRegistrant(res);
              this.registrant = {...this.regService.getCurrentRegistrant()};
              this.retailer = this.regService.getCurrentRetailer();

              // check reg status
              this.checkRegStatus(res.registrant);

              // get wave caps
              this.getCaps(res.retailer);
            } else {
              this.logout();
            }
          },
          err => this.logout()
        );
    } else {
      this.checkRegStatus(this.registrant);
      this.getCaps(this.retailer);
    }
  }

  checkRegStatus(data) {
    if (data._id) {
      this.registered = true;
    } else {
      this.registered = false;
    }
  }

  getOptions() {
    this.regService.getOptions()
      .subscribe(
        res => {
          this.options = res;
          this.checkFormStatus();
        },
        err => this.showError()
      );
  }

  getCaps(data) {
    this.regService.getCaps(data)
      .subscribe(
        res => {
          this.waves = res;

          this.full = this.testCaps(res);

          this.checkFormStatus();
        },
        err => this.showError()
      );
  }

  testCaps(caps) {
    if (caps.filter(cap => cap.capped).length === caps.length) {
      return true;
    } else {
      return false;
    }
  }

  checkFormStatus() {
    if (this.registrant.jlr_id && this.options.jobs && this.waves) {
      this.formLoading = false;
    } else {
      this.formLoading = true;
    }
  }

  changeStep(stepper, idx) {
    if (stepper) {
      stepper.selectedIndex = idx;
    }
  }

  checkReg(data, form, stepper, idx) {
    this.regChecked = true;

    if (form.control.controls.first_name.valid && form.control.controls.last_name.valid && form.control.controls.email.valid && form.control.controls.jlr_id.valid && form.control.controls.job.valid && form.control.controls.retailer.valid) {
      this.loading = true;

      this.regService.verifyId(data)
        .subscribe(
          res => {
            if (res.valid) {
              this.changeStep(stepper, idx);
            } else {
              this.invalid = true;
              this.err = res.message;
            }
            this.loading = false;
          },
          err => this.showError()
        );
    } else {
      console.log('invalid form', form.control.controls);
    }
    return false;
  }

  submit(data, isValid) {
    this.submitted = true;

    if (isValid) {
      this.loading = true;

      this.regService.createRegistrant(data)
        .subscribe(
          regRes => {
            this.regService.setCurrentRegistrant(regRes);

            this.emailService.sendConfirmation(regRes)
              .subscribe(
                emlRes => {
                  this.loading = false;
                  this.success = true;
                },
                err => this.showError()
              );
          },
          err => this.showError()
        );
    }
    return false;
  }

  showError() {
    this.error = true;
    this.loading = false;
  }

  hideError() {
    this.invalid = false;
    this.error = false;
    this.err = '';
  }

  logout() {
    // clear cookies
    this.cookieService.remove('regId');

    // clear stored registrant
    this.regService.clearCurrentRegistrant();

    // redirect to login page
    this.router.navigate(['/login']);
  }
}
