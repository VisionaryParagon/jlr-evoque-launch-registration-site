import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Wave } from '../../../services/classes';
import { WaveService } from '../../../services/wave.service';

import { FadeAnimation, TopDownAnimation } from '../../../animations';

@Component({
  selector: 'app-wave-form',
  templateUrl: './wave-form.component.html',
  styleUrls: ['./wave-form.component.scss'],
  animations: [ FadeAnimation, TopDownAnimation ]
})
export class WaveFormComponent implements OnInit {
  wave: Wave = new Wave();
  edit = false;
  changeDetected = false;
  submitted = false;
  loading = false;
  success = false;
  invalid = false;
  seatMax = false;
  seatMin = false;
  roomMax = false;
  roomMin = false;
  error = false;
  err = '';

  constructor(
    public dialogRef: MatDialogRef<WaveFormComponent>,
    private waveService: WaveService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick()
      .subscribe(
        res => this.closeDialog()
      );

    if (this.data._id) {
      this.edit = true;
      this.wave = this.data;
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

  checkSeats(seats, rooms) {
    if (seats < rooms) {
      this.seatMax = true;
    } else if (seats < 0) {
      this.seatMin = true;
    } else {
      this.seatMax = false;
      this.seatMin = false;
    }
  }

  checkRooms(seats, rooms) {
    if (rooms > seats) {
      this.roomMax = true;
    } else if (rooms < 0) {
      this.roomMin = true;
    } else {
      this.roomMax = false;
      this.roomMin = false;
    }
  }

  submit(data, isValid) {
    this.submitted = true;

    if (isValid && !this.seatMax && !this.seatMin && !this.roomMax && !this.roomMin) {
      this.loading = true;

      if (!this.edit) {
        this.waveService.createWave(data)
          .subscribe(
            res => {
              if (res._id) {
                this.loading = false;
                this.success = true;
              } else {
                this.loading = false;
                this.invalid = true;
                this.err = 'Wave already exists';
              }
            },
            err => this.showError()
          );
      } else {
        this.waveService.updateWave(data)
          .subscribe(
            regRes => {
              this.loading = false;
              this.success = true;
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
    this.seatMax = false;
    this.seatMin = false;
    this.roomMax = false;
    this.roomMin = false;
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
        this.dialogRef.close(this.wave);
      }
    } else {
      this.dialogRef.close(this.wave);
    }
  }
}
