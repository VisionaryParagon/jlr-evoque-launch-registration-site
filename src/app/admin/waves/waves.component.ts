import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';

import { Registrant, Wave } from '../../services/classes';
import { RegistrationService } from '../../services/registration.service';
import { WaveService } from '../../services/wave.service';

import { FadeAnimation, TopDownAnimation } from '../../animations';

@Component({
  selector: 'app-waves',
  templateUrl: './waves.component.html',
  styleUrls: ['./waves.component.scss'],
  animations: [ FadeAnimation, TopDownAnimation ]
})
export class WavesComponent implements OnInit {
  waves: Wave[];
  registrants: Registrant[];
  dataSource: MatTableDataSource<Wave>;
  displayedColumns: string[] = [
    'wave',
    'seats',
    'seats_remaining',
    'rooms',
    'rooms_remaining'
  ];
  selectedWave: Wave;
  loading = true;
  error = false;

  @ViewChild('tableFunctions') tableFunctions: ElementRef;
  @ViewChild('tableContainer') tableContainer: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private regService: RegistrationService,
    private waveService: WaveService
  ) { }

  ngOnInit() {
    this.waveService.getWaves()
      .subscribe(
        wvRes => {
          this.waves = wvRes;

          this.regService.getRegistrants()
            .subscribe(
              regRes => {
                this.registrants = regRes;
                this.waves.forEach(wv => {
                  const regWave = this.registrants.filter(reg => reg.wave === wv.wave);
                  const regHotel = regWave.filter(reg => reg.hotel);

                  wv.seats_remaining = wv.seats - regWave.length;
                  wv.rooms_remaining = wv.rooms - regHotel.length;
                });
                this.dataSource = new MatTableDataSource(this.waves);
                this.dataSource.sort = this.sort;
                this.setHeight();
                this.loading = false;
              },
              err => this.showError()
            );
        },
        err => this.showError()
      );
  }

  @HostListener('window:resize') resize() {
    this.setHeight();
  }

  setHeight() {
    this.tableContainer.nativeElement.style.height = window.innerHeight - this.tableFunctions.nativeElement.offsetHeight - 132 + 'px';
  }

  filter(data) {
    this.dataSource.filter = data.trim().toLowerCase();
  }

  select(wave) {
    this.selectedWave === wave ? this.selectedWave = null : this.selectedWave = wave;
  }

  showError() {
    this.error = true;
  }

  hideError() {
    this.error = false;
  }
}
