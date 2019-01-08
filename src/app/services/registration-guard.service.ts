import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { CookieService } from 'ngx-cookie';

import { RegistrationService } from './registration.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationGuardService implements CanActivate {
  constructor(
    private router: Router,
    private cookieService: CookieService,
    private regService: RegistrationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.cookieService.get('regId')) {
      return true;
    }

    // Save redirect URL
    this.regService.returnUrl = state.url;

    // Clear current user
    this.regService.clearCurrentRegistrant();

    // Navigate to the login page
    this.router.navigate(['/login']);
    return false;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }
}
