import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { WaveService } from '../../../services/wave.service';

import { FadeAnimation } from '../../../animations';

@Component({
  selector: 'app-wave-delete',
  templateUrl: './wave-delete.component.html',
  styleUrls: ['./wave-delete.component.scss'],
  animations: [ FadeAnimation ]
})
export class WaveDeleteComponent implements OnInit {
  loading = false;
  success = false;
  error = false;

  constructor(
    public dialogRef: MatDialogRef<WaveDeleteComponent>,
    private waveService: WaveService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
  }

  delete() {
    this.loading = true;

    this.waveService.deleteWave(this.data)
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
