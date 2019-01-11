import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';

import { Registrant } from '../../services/classes';
import { RegistrationService } from '../../services/registration.service';

import { FadeAnimation, TopDownAnimation } from '../../animations';

@Component({
  selector: 'app-registrants',
  templateUrl: './registrants.component.html',
  styleUrls: ['./registrants.component.scss'],
  animations: [ FadeAnimation, TopDownAnimation ]
})
export class RegistrantsComponent implements OnInit {
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
  selectedRegistrant: Registrant;
  loading = true;
  error = false;

  @ViewChild('tableFunctions') tableFunctions: ElementRef;
  @ViewChild('tableContainer') tableContainer: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private regService: RegistrationService
  ) { }

  ngOnInit() {
    this.regService.getRegistrants()
      .subscribe(
        res => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.sort = this.sort;
          this.setHeight();
          this.loading = false;
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

  select(registrant) {
    this.selectedRegistrant === registrant ? this.selectedRegistrant = null : this.selectedRegistrant = registrant;
  }

  showError() {
    this.error = true;
  }

  hideError() {
    this.error = false;
  }
}
