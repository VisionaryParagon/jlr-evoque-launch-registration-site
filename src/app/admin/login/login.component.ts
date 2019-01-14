import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Admin } from '../../services/classes';
import { AdminService } from '../../services/admin.service';

import { FadeAnimation, TopDownAnimation } from '../../animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [ FadeAnimation, TopDownAnimation ]
})
export class LoginComponent implements OnInit {
  admin: Admin = new Admin();
  returnUrl: string;
  submitted = false;
  loading = false;
  success = false;
  invalid = false;
  error = false;

  constructor(
    private router: Router,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    // Get return url from route parameters or default to Home
    this.returnUrl = this.adminService.returnUrl || '/admin';
  }

  login(data, isValid) {
    this.submitted = true;

    if (isValid) {
      this.loading = true;

      this.adminService.login(data)
        .subscribe(
          res => {
            this.loading = false;

            if (res.message === 'Login successful!') {
              // Save login status
              // this.adminService.setLoginStatus(true);

              // Redirect to saved URL or home
              this.router.navigateByUrl(this.returnUrl);
            } else {
              this.invalid = true;
            }
          },
          err => {
            this.loading = false;

            if (err.error.name === ('IncorrectUsernameError' || 'IncorrectPasswordError')) {
              this.invalid = true;
            } else {
              this.showError();
            }
          }
        );
    }
    return false;
  }

  showError() {
    this.error = true;
  }

  hideError() {
    this.invalid = false;
    this.error = false;
  }
}
