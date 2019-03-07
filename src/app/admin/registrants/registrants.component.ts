import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Registrant } from '../../services/classes';
import { AdminService } from '../../services/admin.service';
import { RegistrationService } from '../../services/registration.service';

import { FadeAnimation, TopDownAnimation } from '../../animations';

import { RegistrantFormComponent } from '../modals/registrant-form/registrant-form.component';
import { RegistrantDeleteComponent } from '../modals/registrant-delete/registrant-delete.component';
import { RegistrantCsvComponent } from '../csv/registrant-csv/registrant-csv.component';

@Component({
  selector: 'app-registrants',
  templateUrl: './registrants.component.html',
  styleUrls: ['./registrants.component.scss'],
  animations: [ FadeAnimation, TopDownAnimation ]
})
export class RegistrantsComponent implements OnInit {
  admin = this.adminService.state;
  registrants: Registrant[];
  dataSource: MatTableDataSource<Registrant>;
  displayedColumns: string[] = [
    'first_name',
    'last_name',
    'email',
    'jlr_id',
    'job',
    'retailer',
    'retailer_code',
    'region_number',
    'region',
    'market',
    'hotel',
    'wave',
    'diet',
    'special',
    'created',
    'modified'
  ];
  pageIndex = 0;
  selectedRegistrant: Registrant = new Registrant();
  filter = '';
  filterTimeout: any;
  sorter = 'modified';
  sortOrder = 'desc';
  loading = true;
  error = false;

  @ViewChild('tableFunctions') tableFunctions: ElementRef;
  @ViewChild('tableContainer') tableContainer: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private adminService: AdminService,
    private regService: RegistrationService
  ) { }

  ngOnInit() {
    this.getRegistrants();
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

  getRegistrants() {
    this.regService.getRegistrants()
      .subscribe(
        res => {
          this.registrants = res;
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.search(this.filter);
          this.setHeight();
          this.loading = false;
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
      this.registrants = this.dataSource.filteredData;
      this.pageIndex = 0;
      this.scrollTop();
      this.loading = false;
    }, 1000);
  }

  clearFilter() {
    this.filter = '';
    this.search(this.filter);
  }

  select(registrant) {
    this.selectedRegistrant === registrant ? this.selectedRegistrant = new Registrant() : this.selectedRegistrant = registrant;
  }

  newReg() {
    const dialogRef = this.dialog.open(RegistrantFormComponent, {
      data: new Registrant(),
      maxHeight: '90vh',
      maxWidth: '90vw',
      width: '768px'
    });

    dialogRef.afterClosed()
      .subscribe(
        data => {
          this.loading = true;
          this.selectedRegistrant = new Registrant();
          this.getRegistrants();
        }
      );
  }

  editReg(registrant) {
    const dialogRef = this.dialog.open(RegistrantFormComponent, {
      data: registrant,
      maxHeight: '90vh',
      maxWidth: '90vw',
      width: '768px'
    });

    dialogRef.afterClosed()
      .subscribe(
        data => {
          this.loading = true;
          this.selectedRegistrant = new Registrant();
          this.getRegistrants();
        }
      );
  }

  deleteReg(registrant) {
    const dialogRef = this.dialog.open(RegistrantDeleteComponent, {
      data: registrant,
      maxHeight: '90vh',
      maxWidth: '90vw',
      width: '768px'
    });

    dialogRef.afterClosed()
      .subscribe(
        data => {
          this.loading = true;
          this.selectedRegistrant = new Registrant();
          this.getRegistrants();
        }
      );
  }

  showError() {
    this.error = true;
    this.loading = false;
  }

  hideError() {
    this.error = false;
  }
}
