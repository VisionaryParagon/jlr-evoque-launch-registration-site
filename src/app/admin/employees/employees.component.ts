import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Employee } from '../../services/classes';
import { AdminService } from '../../services/admin.service';
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
  admin = this.adminService.state;
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
  pageIndex = 0;
  selectedEmployee: Employee = new Employee();
  filter = '';
  filterTimeout: any;
  sorter = 'last_name';
  sortOrder = 'asc';
  loading = true;
  error = false;

  @ViewChild('tableFunctions') tableFunctions: ElementRef;
  @ViewChild('tableContainer') tableContainer: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private adminService: AdminService,
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

  scrollTop() {
    document.querySelector('.adminTable').scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth'
    });
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
      this.employees = this.dataSource.filteredData;
      this.pageIndex = 0;
      this.scrollTop();
      this.loading = false;
    }, 1000);
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
