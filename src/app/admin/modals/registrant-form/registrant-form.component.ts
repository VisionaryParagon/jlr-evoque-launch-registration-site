import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Registrant, Retailer, Options } from '../../../services/classes';
import { RegistrationService } from '../../../services/registration.service';
import { EmailService } from '../../../services/email.service';

import { FadeAnimation, TopDownAnimation } from '../../../animations';

@Component({
  selector: 'app-registrant-form',
  templateUrl: './registrant-form.component.html',
  styleUrls: ['./registrant-form.component.scss'],
  animations: [ FadeAnimation, TopDownAnimation ]
})
export class RegistrantFormComponent implements OnInit {
  registrant: Registrant = new Registrant();
  retailer: Retailer = new Retailer();
  options: Options = new Options();
  waves: any[];
  edit = false;
  selectedIndex = 0;
  formLoading = true;
  anyVal;
  waveNote = '';
  waveFilter: string[];
  changeDetected = false;
  regChecked = false;
  submitted = false;
  loading = false;
  success = false;
  invalid = false;
  error = false;
  err = '';

  constructor(
    public dialogRef: MatDialogRef<RegistrantFormComponent>,
    private regService: RegistrationService,
    private emailService: EmailService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick()
      .subscribe(
        res => this.closeDialog()
      );

    this.regService.clearCurrentRegistrant();
    this.getOptions();

    if (this.data._id) {
      this.edit = true;
      this.selectedIndex = 1;

      this.regService.loginRegistrant(this.data)
        .subscribe(
          res => {
            if (res.message === 'Success') {
              this.regService.setCurrentRegistrant(res);
              this.registrant = {...this.regService.getCurrentRegistrant()};
              this.retailer = this.regService.getCurrentRetailer();

              this.waveFilter = this.registrant.wave.split(' - ');

              this.getCaps(this.retailer);
              this.setWaveNote(this.retailer);
            } else if (res.message === 'Retailer not found') {
              this.invalid = true;
              this.err = 'Registrant’s retailer information could not be found';
            } else {
              this.invalid = true;
              this.err = 'Registrant’s Training ID is invalid or they are not authorized to attend this event';
            }
          },
          err => this.showError()
        );
    }
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.closeDialog();
  }

  @HostListener('window:beforeunload', ['$event']) unloadHandler(event: Event) {
    if (this.changeDetected && !this.success) {
      event.returnValue = false;
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
    this.regService.getAllCaps(data)
      .subscribe(
        res => {
          this.waves = res;

          this.testCaps(res);

          this.checkFormStatus();
        },
        err => this.showError()
      );
  }

  setWaveNote(retailer) {
    const wave = retailer.waves[0];

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
    if (!this.edit && caps.filter(cap => cap.retailerCapped).length === caps.length) {
      this.invalid = true;
      this.err = 'This retailer’s allocated number of seats have already been filled.';
    } else if (!this.edit && caps.filter(cap => cap.waveCapped).length === caps.length) {
      this.invalid = true;
      this.err = 'All seats for this event have been filled.';
    } else {
      if (this.selectedIndex === 0) {
        this.selectedIndex = 1;
      }
    }
  }

  checkFormStatus() {
    if (this.registrant.jlr_id && this.options.jobs && this.waves) {
      this.formLoading = false;
    } else {
      this.formLoading = true;
    }
  }

  changeStep(idx) {
    this.selectedIndex = idx;
  }

  checkReg(data, form) {
    this.regChecked = true;

    if (form.controls.jlr_id.valid) {
      this.loading = true;

      this.regService.loginRegistrant(data)
        .subscribe(
          res => {
            this.loading = false;

            if (res.message === 'Success') {
              if (res.registrant._id) {
                this.invalid = true;
                this.err = 'This Training ID is already registered. To edit their registration information, select them in the Registrants data table and click the Edit button.';
              } else {
                this.regService.setCurrentRegistrant(res);
                this.registrant = {...this.regService.getCurrentRegistrant()};
                this.retailer = this.regService.getCurrentRetailer();

                this.getCaps(this.retailer);
              }
            } else if (res.message === 'Retailer not found') {
              this.invalid = true;
              this.err = 'Registrant’s retailer information could not be found';
            } else {
              this.invalid = true;
              this.err = 'Registrant’s Training ID is invalid or they are not authorized to attend this event';
            }
          },
          err => this.showError()
        );
    }
    return false;
  }

  submit(data, isValid) {
    this.submitted = true;

    if (isValid) {
      this.loading = true;

      if (!this.edit) {
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
      } else {
        this.regService.updateRegistrant(data)
          .subscribe(
            regRes => {
              this.regService.setCurrentRegistrant(regRes);

              this.waveFilter = this.registrant.wave.split(' - ');

              this.emailService.sendUpdated(regRes)
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

  changed() {
    this.changeDetected = true;
  }

  closeDialog() {
    if (this.changeDetected && !this.success) {
      if (confirm('These changes haven’t been submitted yet. Are you sure you want to leave?')) {
        this.regService.clearCurrentRegistrant();
        this.dialogRef.close(this.registrant);
      }
    } else {
      this.regService.clearCurrentRegistrant();
      this.dialogRef.close(this.registrant);
    }
  }
}
