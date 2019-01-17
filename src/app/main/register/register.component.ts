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
  retailerFull = false;
  waveFull = false;
  anyVal;
  waveNote = '';
  waveFilter: string[];
  regChecked = false;
  submitted = false;
  loading = false;
  success = false;
  invalid = false;
  waveError = false;
  waveErr = '';
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
      this.waveFilter = data.wave.split(' - ');
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

          this.setWaveNote(res);

          this.testCaps(res);

          this.checkFormStatus();
        },
        err => this.showError()
      );
  }

  setWaveNote(waves) {
    const wave = waves[0].wave;

    if (wave.indexOf('Miami, FL') !== -1 && this.registrant.hotel) {
      this.waveNote = 'Your Training Location is the Marriott Miami Airport. We’ll book a hotel room for you the night PRIOR to your training date.';
    } else if (wave.indexOf('Miami, FL') !== -1 && !this.registrant.hotel) {
      this.waveNote = 'Your Training Location is the Marriott Miami Airport.';
    } else if (wave.indexOf('Irving, TX') !== -1 && this.registrant.hotel) {
      this.waveNote = 'Your Training Location is the Doubletree by Hilton DFW North. We’ll book a hotel room for you the night PRIOR to your training date.';
    } else if (wave.indexOf('Irving, TX') !== -1 && !this.registrant.hotel) {
      this.waveNote = 'Your Training Location is the Doubletree by Hilton DFW North.';
    } else if (wave.indexOf('Rosemont, IL') !== -1 && this.registrant.hotel) {
      this.waveNote = 'Your Training Location is theSheraton Suites O’Hare Airport. We’ll book a hotel room for you the night PRIOR to your training date.';
    } else if (wave.indexOf('Rosemont, IL') !== -1 && !this.registrant.hotel) {
      this.waveNote = 'Your Training Location is the Sheraton Suites O’Hare Airport.';
    } else if (wave.indexOf('Santa Ana, CA') !== -1 && this.registrant.hotel) {
      this.waveNote = 'Your Training Location is the Doubletree by Hilton Santa Ana - Orange County Airport. We’ll book a hotel room for you the night PRIOR to your training date.';
    } else if (wave.indexOf('Santa Ana, CA') !== -1 && !this.registrant.hotel) {
      this.waveNote = 'Your Training Location is the Doubletree by Hilton Santa Ana - Orange County Airport.';
    } else if (wave.indexOf('Oakland, CA') !== -1 && this.registrant.hotel) {
      this.waveNote = 'Your Training Location is the Hilton Oakland Airport. We’ll book a hotel room for you the night PRIOR to your training date.';
    } else if (wave.indexOf('Oakland, CA') !== -1 && !this.registrant.hotel) {
      this.waveNote = 'Your Training Location is the Hilton Oakland Airport.';
    } else if (wave.indexOf('Mahwah, NJ') !== -1 && this.registrant.hotel) {
      this.waveNote = 'Your Training Location is the Jaguar Land Rover North American Headquarters. We will book a hotel room for you at the Sheraton Mahwah Hotel the night PRIOR to your training date.';
    } else if (wave.indexOf('Mahwah, NJ') !== -1 && !this.registrant.hotel) {
      this.waveNote = 'Your Training Location is the Jaguar Land Rover North American Headquarters - Mahwah, NJ.';
    } else if (wave.indexOf('Toronto, ON') !== -1 && this.registrant.hotel) {
      this.waveNote = 'Your Training Location is the Hilton Garden Inn Toronto Airport. We’ll book a hotel room for you the night PRIOR to your training date.';
    } else if (wave.indexOf('Toronto, ON') !== -1 && !this.registrant.hotel) {
      this.waveNote = 'Your Training Location is the Hilton Garden Inn Toronto Airport.';
    }
  }

  testCaps(caps) {
    if (caps.filter(cap => cap.retailerCapped).length === caps.length) {
      this.retailerFull = true;
    } else if (caps.filter(cap => cap.waveCapped).length === caps.length) {
      this.waveFull = true;
    } else {
      this.retailerFull = false;
      this.waveFull = false;
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

      this.regService.getCaps(this.retailer)
        .subscribe(
          capRes => {
            const capCheck = capRes.filter(cap => cap.wave === data.wave)[0];

            if (capRes.filter(cap => cap.retailerCapped).length === capRes.length) {
              this.retailerFull = true;
              this.loading = false;
            } else if (capRes.filter(cap => cap.waveCapped).length === capRes.length) {
              this.waveFull = true;
              this.loading = false;
            } else if (capCheck.waveCapped) {
              this.waves = capRes;
              this.waveError = true;
              this.waveErr = 'The wave you selected has just been filled. Please select another wave.';
              this.loading = false;
            } else {
              this.retailerFull = false;
              this.waveFull = false;

              this.regService.createRegistrant(data)
                .subscribe(
                  regRes => {
                    this.regService.setCurrentRegistrant(regRes);

                    this.waveFilter = this.registrant.wave.split(' - ');

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
    this.waveError = false;
    this.waveErr = '';
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
