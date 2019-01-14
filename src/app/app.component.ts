import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';

import { CookieService } from 'ngx-cookie';

import { Registrant } from './services/classes';
import { GoogleAnalyticsEventsService } from './services/google-analytics-events.service';
import { RegistrationService } from './services/registration.service';
import { AdminService } from './services/admin.service';

import { NavAnimation, FadeAnimation } from './animations';

declare let ga: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [ NavAnimation, FadeAnimation ]
})
export class AppComponent implements OnInit {
  lastPoppedUrl: string;
  yScrollStack: number[] = [];
  isLoggedIn = this.regService.state;
  isLoggedInAdmin = this.adminService.state;
  isLogin = false;
  isAdmin = false;
  navActive = false;

  constructor(
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    private router: Router,
    private location: Location,
    private cookieService: CookieService,
    private regService: RegistrationService,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });

    this.router.events.subscribe((ev: any) => {
      if (ev instanceof NavigationStart) {
        // save page scroll location
        if (ev.url !== this.lastPoppedUrl) {
          this.yScrollStack.push(window.scrollY);
        }
      } else if (ev instanceof NavigationEnd) {
        // Google Analytics events
        ga('set', 'page', ev.urlAfterRedirects);
        ga('send', 'pageview');

        // set page scroll
        if (ev.url === this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop());
        } else {
          window.scrollTo(0, 0);
        }

        // route checks for nav
        if (ev.urlAfterRedirects.indexOf('/login') !== -1) {
          this.isLogin = true;
        } else {
          this.isLogin = false;
        }

        if (ev.urlAfterRedirects.indexOf('/admin') === 0) {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
      }
    });
  }

  @HostListener('window:resize') resize(ev) {
    this.closeNav();
  }

  toggleNav() {
    this.navActive = !this.navActive;

    if (document.documentElement.classList.contains('modal-open')) {
      document.documentElement.classList.remove('modal-open');
    } else {
      document.documentElement.classList.add('modal-open');
    }
  }

  closeNav() {
    this.navActive = false;
    document.documentElement.classList.remove('modal-open');
  }

  logout() {
    this.closeNav();
    this.cookieService.removeAll();
    this.regService.clearCurrentRegistrant();
    this.router.navigate(['/login']);
  }

  logoutAdmin() {
    this.closeNav();
    this.cookieService.removeAll();
    this.adminService.logout()
      .subscribe(
        res => this.router.navigate(['/admin/login']),
        err => console.log('Could not log out admin')
      );
  }
}
