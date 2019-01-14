import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Registrant, Retailer } from '../../services/classes';
import { RegistrationService } from '../../services/registration.service';
import { RetailerService } from '../../services/retailer.service';

import { FadeAnimation, TopDownAnimation } from '../../animations';

@Component({
  selector: 'app-retailers',
  templateUrl: './retailers.component.html',
  styleUrls: ['./retailers.component.scss'],
  animations: [ FadeAnimation, TopDownAnimation ]
})
export class RetailersComponent implements OnInit {
  retailers: Retailer[];
  registrants: Registrant[];
  dataSource: MatTableDataSource<Retailer>;
  displayedColumns: string[] = [
    'retailer',
    'hotel',
    'seats',
    'seats_remaining',
    'rooms',
    'rooms_remaining',
    'retailer_code',
    'region',
    'market',
    'waves'
  ];
  selectedRetailer: Retailer;
  filter = '';
  loading = true;
  error = false;

  @ViewChild('tableFunctions') tableFunctions: ElementRef;
  @ViewChild('tableContainer') tableContainer: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private regService: RegistrationService,
    private retailerService: RetailerService
  ) { }

  ngOnInit() {
    this.retailerService.getRetailers()
      .subscribe(
        retRes => {
          this.retailers = retRes;

          this.regService.getRegistrants()
            .subscribe(
              regRes => {
                this.registrants = regRes;
                this.retailers.forEach(ret => {
                  const regRetailer = this.registrants.filter(reg => reg.retailer === ret.retailer);

                  ret.seats_remaining = ret.seats - regRetailer.length;
                  if (ret.hotel) {
                    ret.rooms_remaining = ret.rooms - regRetailer.length;
                  } else {
                    ret.rooms_remaining = 0;
                  }
                });
                this.dataSource = new MatTableDataSource(this.retailers);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
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
    let offset; // header and section padding

    if (window.innerWidth >= 768) {
      offset = 132;
    } else {
      offset = 108;
    }

    this.tableContainer.nativeElement.style.height = window.innerHeight - this.tableFunctions.nativeElement.offsetHeight - offset + 'px';
  }

  search(data) {
    this.dataSource.filter = data.trim().toLowerCase();
  }

  clearFilter() {
    this.filter = '';
    this.search(this.filter);
  }

  select(retailer) {
    this.selectedRetailer === retailer ? this.selectedRetailer = null : this.selectedRetailer = retailer;
  }

  showError() {
    this.error = true;
  }

  hideError() {
    this.error = false;
  }
}
