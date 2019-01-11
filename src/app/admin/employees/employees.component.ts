import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';

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
  loading = true;
  error = false;

  @ViewChild('tableFunctions') tableFunctions: ElementRef;
  @ViewChild('tableContainer') tableContainer: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private employeeService: EmployeeService
  ) { }

  ngOnInit() {
    this.employeeService.getEmployees()
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
