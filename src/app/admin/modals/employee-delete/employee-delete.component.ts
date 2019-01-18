import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { EmployeeService } from '../../../services/employee.service';

import { FadeAnimation } from '../../../animations';

@Component({
  selector: 'app-employee-delete',
  templateUrl: './employee-delete.component.html',
  styleUrls: ['./employee-delete.component.scss'],
  animations: [ FadeAnimation ]
})
export class EmployeeDeleteComponent implements OnInit {
  loading = false;
  success = false;
  error = false;

  constructor(
    public dialogRef: MatDialogRef<EmployeeDeleteComponent>,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
  }

  delete() {
    this.loading = true;

    this.employeeService.deleteEmployee(this.data)
      .subscribe(
        res => {
          this.loading = false;
          this.success = true;
        },
        err => this.showError()
      );

    return false;
  }

  showError() {
    this.error = true;
    this.loading = false;
  }

  hideError() {
    this.error = false;
  }
}
