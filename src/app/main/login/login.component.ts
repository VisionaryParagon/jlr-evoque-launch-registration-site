import { Component, HostListener, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { CookieService, CookieOptions } from 'ngx-cookie';

import { Registrant, Employee, Retailer } from '../../services/classes';
import { RegistrationService } from '../../services/registration.service';

import { FadeAnimation, TopDownAnimation } from '../../animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [ FadeAnimation, TopDownAnimation ]
})
export class LoginComponent implements OnInit {
  registrant: Registrant = new Registrant();
  regId: string = this.cookieService.get('regId');
  cookieExp = new Date();
  cookieOptions: CookieOptions = {
    expires: new Date()
  };
  isHorizontal = false;
  videoTag;
  showBox = false;
  returnUrl: string;
  submitted = false;
  loading = false;
  invalid = false;
  error = false;
  err = '';

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private cookieService: CookieService,
    private regService: RegistrationService
  ) { }

  ngOnInit() {
    this.checkWindow();
    this.videoTag = this.sanitizer.bypassSecurityTrustHtml(
      `<video height="100%" width="100%" muted loop playsinline autoplay poster="../../../assets/images/evoque-video-bg-poster.jpg">
        <source src="../../../assets/videos/evoque-video-bg.mp4" type="video/mp4">
        <source src="../../../assets/videos/evoque-video-bg.webm" type="video/webm">
      </video>`
    );

    setTimeout(() => {
      this.showBox = true;
    }, 500);

    if (this.regId) {
      this.router.navigate(['../']);
    }

    // Set cookie exp
    this.cookieExp.setDate(this.cookieExp.getDate() + 7);
    this.cookieOptions.expires = this.cookieExp;

    // Get return url from route parameters or default to Home
    this.returnUrl = this.regService.returnUrl || '/';
    // this.returnUrl = '/';
  }

  @HostListener('window:resize') resize() {
    this.checkWindow();
  }

  checkWindow() {
    if (window.innerHeight * 16 / 9 <= window.innerWidth) {
      this.isHorizontal = true;
    } else {
      this.isHorizontal = false;
    }
  }

  login(data, isValid) {
    this.submitted = true;

    if (isValid) {
      this.loading = true;

      this.regService.loginRegistrant(data)
        .subscribe(
          res => {
            this.loading = false;

            if (res.message === 'Success') {
              // store registrant data
              this.regService.setCurrentRegistrant(res);

              // set cookie
              this.cookieService.put('regId', this.registrant.jlr_id, this.cookieOptions);

              // redirect to returnUrl
              this.router.navigate([this.returnUrl]);
            } else if (res.message === 'Retailer not found') {
              this.invalid = true;
              this.err = 'Your dealership information could not be found';
            } else {
              this.invalid = true;
              this.err = 'Your Training ID is invalid or you are not authorized to attend this event';
            }
          },
          err => this.showError()
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
    this.err = '';
  }
}
