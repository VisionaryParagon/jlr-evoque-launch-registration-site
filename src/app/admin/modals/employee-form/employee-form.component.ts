import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Employee, Retailer } from '../../../services/classes';
import { EmployeeService } from '../../../services/employee.service';
import { RetailerService } from '../../../services/retailer.service';

import { FadeAnimation, TopDownAnimation } from '../../../animations';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
  animations: [ FadeAnimation, TopDownAnimation ]
})
export class EmployeeFormComponent implements OnInit {
  employee: Employee = new Employee();
  retailers: Retailer[] = [];
  edit = false;
  changeDetected = false;
  submitted = false;
  loading = false;
  success = false;
  invalid = false;
  error = false;
  err = '';

  constructor(
    public dialogRef: MatDialogRef<EmployeeFormComponent>,
    private employeeService: EmployeeService,
    private retailerService: RetailerService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick()
      .subscribe(
        res => this.closeDialog()
      );

    this.retailerService.getRetailers()
      .subscribe(
        res => this.retailers = res.sort((a, b) => {
          const x = a['retailer'];
          const y = b['retailer'];
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }),
        err => this.showError()
      );

    if (this.data._id) {
      this.edit = true;
      this.employee = this.data;
    }
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.closeDialog();
  }

  @HostListener('window:beforeunload', ['$event']) unloadHandler(event: Event) {
    if (this.changeDetected && !this.success) {
      event.returnValue = false;
    }
  }

  submit(data, isValid) {
    this.submitted = true;

    if (isValid) {
      this.loading = true;

      if (!this.edit) {
        this.employeeService.createEmployee(data)
          .subscribe(
            res => {
              if (res._id) {
                this.loading = false;
                this.success = true;
              } else {
                this.loading = false;
                this.invalid = true;
                this.err = 'Employee already exists';
              }
            },
            err => this.showError()
          );
      } else {
        this.employeeService.updateEmployee(data)
          .subscribe(
            regRes => {
              this.loading = false;
              this.success = true;
            },
            err => this.showError()
          );
      }
    }
    return false;
  }

  showError() {
    this.error = true;
    this.loading = false;
  }

  hideError() {
    this.invalid = false;
    this.error = false;
    this.err = '';
  }

  changed() {
    this.changeDetected = true;
  }

  closeDialog() {
    if (this.changeDetected && !this.success) {
      if (confirm('These changes haven’t been submitted yet. Are you sure you want to leave?')) {
        this.dialogRef.close(this.employee);
      }
    } else {
      this.dialogRef.close(this.employee);
    }
  }
}
