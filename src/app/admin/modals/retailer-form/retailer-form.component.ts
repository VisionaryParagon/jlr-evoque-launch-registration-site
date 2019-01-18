import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Retailer, Wave } from '../../../services/classes';
import { RetailerService } from '../../../services/retailer.service';
import { WaveService } from '../../../services/wave.service';

import { FadeAnimation, TopDownAnimation } from '../../../animations';

@Component({
  selector: 'app-retailer-form',
  templateUrl: './retailer-form.component.html',
  styleUrls: ['./retailer-form.component.scss'],
  animations: [ FadeAnimation, TopDownAnimation ]
})
export class RetailerFormComponent implements OnInit {
  retailer: Retailer = new Retailer();
  retailerCache: Retailer = new Retailer();
  eventWaves: Wave[] = [];
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
    public dialogRef: MatDialogRef<RetailerFormComponent>,
    private retailerService: RetailerService,
    private waveService: WaveService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick()
      .subscribe(
        res => this.closeDialog()
      );

    this.waveService.getWaves()
      .subscribe(
        res => this.eventWaves = res,
        err => this.showError()
      );

    if (this.data._id) {
      this.edit = true;
      this.retailer = this.data;
      this.retailerCache = {...this.data};
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

  setRooms(val) {
    if (!val || val === false) {
      this.retailer.rooms = 0;
    } else {
      this.retailer.rooms = this.retailerCache.rooms;
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
        this.retailerService.createRetailer(data)
          .subscribe(
            res => {
              if (res._id) {
                this.loading = false;
                this.success = true;
              } else {
                this.loading = false;
                this.invalid = true;
                this.err = 'Retailer already exists';
              }
            },
            err => this.showError()
          );
      } else {
        this.retailerService.updateRetailer(data)
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
        this.dialogRef.close(this.retailer);
      }
    } else {
      this.dialogRef.close(this.retailer);
    }
  }
}
