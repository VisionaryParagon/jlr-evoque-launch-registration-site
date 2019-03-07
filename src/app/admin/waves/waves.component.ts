import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Registrant, Wave } from '../../services/classes';
import { AdminService } from '../../services/admin.service';
import { RegistrationService } from '../../services/registration.service';
import { WaveService } from '../../services/wave.service';

import { FadeAnimation, TopDownAnimation } from '../../animations';

import { WaveFormComponent } from '../modals/wave-form/wave-form.component';
import { WaveDeleteComponent } from '../modals/wave-delete/wave-delete.component';
import { WaveCsvComponent } from '../csv/wave-csv/wave-csv.component';

@Component({
  selector: 'app-waves',
  templateUrl: './waves.component.html',
  styleUrls: ['./waves.component.scss'],
  animations: [ FadeAnimation, TopDownAnimation ]
})
export class WavesComponent implements OnInit {
  admin = this.adminService.state;
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
  pageIndex = 0;
  selectedWave: Wave = new Wave();
  filter = '';
  filterTimeout: any;
  sorter = '';
  sortOrder = '';
  loading = true;
  error = false;

  @ViewChild('tableFunctions') tableFunctions: ElementRef;
  @ViewChild('tableContainer') tableContainer: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private adminService: AdminService,
    private regService: RegistrationService,
    private waveService: WaveService
  ) { }

  ngOnInit() {
    this.getWaves();
  }

  @HostListener('window:resize') resize() {
    this.setHeight();
  }

  setHeight() {
    let offset; // header and section padding

    if (window.innerWidth >= 768) {
      offset = 132;
    } else {
      offset = 108;
    }

    this.tableContainer.nativeElement.style.height = window.innerHeight - this.tableFunctions.nativeElement.offsetHeight - offset + 'px';
  }

  scrollTop() {
    document.querySelector('.adminTable').scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth'
    });
  }

  getWaves() {
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
                this.dataSource.paginator = this.paginator;
                this.search(this.filter);
                this.setHeight();
                this.loading = false;
              },
              err => this.showError()
            );
        },
        err => this.showError()
      );
  }

  sortData(data) {
    this.sorter = data.active;
    this.sortOrder = data.direction;
  }

  search(data) {
    this.loading = true;

    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.dataSource.filter = data.trim().toLowerCase();
      this.waves = this.dataSource.filteredData;
      this.pageIndex = 0;
      this.scrollTop();
      this.loading = false;
    }, 1000);
  }

  clearFilter() {
    this.filter = '';
    this.search(this.filter);
  }

  select(wave) {
    this.selectedWave === wave ? this.selectedWave = new Wave() : this.selectedWave = wave;
  }

  newWave() {
    const dialogRef = this.dialog.open(WaveFormComponent, {
      data: new Wave(),
      maxHeight: '90vh',
      maxWidth: '90vw',
      width: '768px'
    });

    dialogRef.afterClosed()
      .subscribe(
        data => {
          this.loading = true;
          this.selectedWave = new Wave();
          this.getWaves();
        }
      );
  }

  editWave(wave) {
    const dialogRef = this.dialog.open(WaveFormComponent, {
      data: wave,
      maxHeight: '90vh',
      maxWidth: '90vw',
      width: '768px'
    });

    dialogRef.afterClosed()
      .subscribe(
        data => {
          this.loading = true;
          this.selectedWave = new Wave();
          this.getWaves();
        }
      );
  }

  deleteWave(wave) {
    const dialogRef = this.dialog.open(WaveDeleteComponent, {
      data: wave,
      maxHeight: '90vh',
      maxWidth: '90vw',
      width: '768px'
    });

    dialogRef.afterClosed()
      .subscribe(
        data => {
          this.loading = true;
          this.selectedWave = new Wave();
          this.getWaves();
        }
      );
  }

  showError() {
    this.error = true;
  }

  hideError() {
    this.error = false;
  }
}
