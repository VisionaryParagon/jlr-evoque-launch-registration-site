import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Employee } from '../../services/classes';
import { EmployeeService } from '../../services/employee.service';

import { FadeAnimation, TopDownAnimation } from '../../animations';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  animations: [ FadeAnimation, TopDownAnimation ]
})
export class EmployeesComponent implements OnInit {
  employees: Employee[];
  dataSource: MatTableDataSource<Employee>;
  displayedColumns: string[] = [
    'first_name',
    'last_name',
    'email',
    'jlr_id',
    'job',
    'retailer',
    'region_number'
  ];
  selectedEmployee: Employee;
  filter = '';
  loading = true;
  error = false;

  @ViewChild('tableFunctions') tableFunctions: ElementRef;
  @ViewChild('tableContainer') tableContainer: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private employeeService: EmployeeService
  ) { }

  ngOnInit() {
    this.employeeService.getEmployees()
      .subscribe(
        res => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
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

  select(employee) {
    this.selectedEmployee === employee ? this.selectedEmployee = null : this.selectedEmployee = employee;
  }

  showError() {
    this.error = true;
  }

  hideError() {
    this.error = false;
  }
}
