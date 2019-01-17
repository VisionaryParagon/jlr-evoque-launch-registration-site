import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { RegistrationService } from '../../../services/registration.service';
import { EmailService } from '../../../services/email.service';

import { FadeAnimation } from '../../../animations';

@Component({
  selector: 'app-registrant-delete',
  templateUrl: './registrant-delete.component.html',
  styleUrls: ['./registrant-delete.component.scss'],
  animations: [ FadeAnimation ]
})
export class RegistrantDeleteComponent implements OnInit {
  loading = false;
  success = false;
  error = false;

  constructor(
    public dialogRef: MatDialogRef<RegistrantDeleteComponent>,
    private regService: RegistrationService,
    private emailService: EmailService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
  }

  delete() {
    this.loading = true;

    this.regService.deleteRegistrant(this.data)
      .subscribe(
        regRes => {
          this.emailService.sendDeleted(this.data)
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

    return false;
  }

  showError() {
    this.error = true;
    this.loading = false;
  }

  hideError() {
    this.error = false;
  }
}
