import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { RetailerService } from '../../../services/retailer.service';

import { FadeAnimation } from '../../../animations';

@Component({
  selector: 'app-retailer-delete',
  templateUrl: './retailer-delete.component.html',
  styleUrls: ['./retailer-delete.component.scss'],
  animations: [ FadeAnimation ]
})
export class RetailerDeleteComponent implements OnInit {
  loading = false;
  success = false;
  error = false;

  constructor(
    public dialogRef: MatDialogRef<RetailerDeleteComponent>,
    private retailerService: RetailerService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
  }

  delete() {
    this.loading = true;

    this.retailerService.deleteRetailer(this.data)
      .subscribe(
        res => {
          this.loading = false;
          this.success = true;
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
