import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie';

import { Registrant } from '../../services/classes';
import { RegistrationService } from '../../services/registration.service';

import { FadeAnimation } from '../../animations';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  animations: [ FadeAnimation ]
})
export class FaqComponent implements OnInit {
  registrant: Registrant = this.regService.getCurrentRegistrant();
  regId: string = this.cookieService.get('regId');
  bgImage = '../../../assets/images/evoque-home-bg.jpg';
  showBox = false;

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private regService: RegistrationService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.showBox = true;
    }, 500);

    if (this.regId && !this.registrant.jlr_id) {
      this.registrant.jlr_id = this.regId;
      this.regService.loginRegistrant(this.registrant)
        .subscribe(
          res => {
            if (res.message === 'Success') {
              // store registrant data
              this.regService.setCurrentRegistrant(res);
              this.registrant = this.regService.getCurrentRegistrant();
            } else {
              this.logout();
            }
          },
          err => this.logout()
        );
    }
  }

  logout() {
    // clear cookies
    this.cookieService.remove('regId');

    // clear stored registrant
    this.regService.clearCurrentRegistrant();

    // redirect to login page
    this.router.navigate(['/login']);
  }
}
