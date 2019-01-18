import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Employee } from '../../services/classes';
import { EmployeeService } from '../../services/employee.service';

import { FadeAnimation, TopDownAnimation } from '../../animations';

import { EmployeeFormComponent } from '../modals/employee-form/employee-form.component';
import { EmployeeDeleteComponent } from '../modals/employee-delete/employee-delete.component';
import { EmployeeCsvComponent } from '../csv/employee-csv/employee-csv.component';

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
  selectedEmployee: Employee = new Employee();
  filter = '';
  loading = true;
  error = false;

  @ViewChild('tableFunctions') tableFunctions: ElementRef;
  @ViewChild('tableContainer') tableContainer: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private employeeService: EmployeeService
  ) { }

  ngOnInit() {
    this.getEmployees();
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

  getEmployees() {
    this.employeeService.getEmployees()
      .subscribe(
        res => {
          this.employees = res;
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

  search(data) {
    this.dataSource.filter = data.trim().toLowerCase();
  }

  clearFilter() {
    this.filter = '';
    this.search(this.filter);
  }

  select(employee) {
    this.selectedEmployee === employee ? this.selectedEmployee = new Employee() : this.selectedEmployee = employee;
  }

  newEmployee() {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      data: new Employee(),
      maxHeight: '90vh',
      maxWidth: '90vw',
      width: '768px'
    });

    dialogRef.afterClosed()
      .subscribe(
        data => {
          this.loading = true;
          this.selectedEmployee = new Employee();
          this.getEmployees();
        }
      );
  }

  editEmployee(employee) {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      data: employee,
      maxHeight: '90vh',
      maxWidth: '90vw',
      width: '768px'
    });

    dialogRef.afterClosed()
      .subscribe(
        data => {
          this.loading = true;
          this.selectedEmployee = new Employee();
          this.getEmployees();
        }
      );
  }

  deleteEmployee(employee) {
    const dialogRef = this.dialog.open(EmployeeDeleteComponent, {
      data: employee,
      maxHeight: '90vh',
      maxWidth: '90vw',
      width: '768px'
    });

    dialogRef.afterClosed()
      .subscribe(
        data => {
          this.loading = true;
          this.selectedEmployee = new Employee();
          this.getEmployees();
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
