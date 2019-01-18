import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie';

import { Registrant, Retailer } from '../../services/classes';
import { RegistrationService } from '../../services/registration.service';

import { FadeAnimation } from '../../animations';

export class LocationData {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  venue: string;
  venueImage: string;
  venueSubtitle: string;
  venueDates: string;
}

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  animations: [ FadeAnimation ]
})
export class LocationComponent implements OnInit {
  retailer: Retailer = this.regService.getCurrentRetailer();
  registrant: Registrant = this.regService.getCurrentRegistrant();
  regId: string = this.cookieService.get('regId');
  location: LocationData = new LocationData();
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
              this.retailer = this.regService.getCurrentRetailer();
              this.setLocation(this.retailer);
            } else {
              this.logout();
            }
          },
          err => this.logout()
        );
    } else {
      this.setLocation(this.retailer);
    }
  }

  setLocation(loc) {
    const city = loc.waves[0].split(' - ')[1];

    this.location.title = city;

    if (city === 'Miami, FL') {
      this.location.id = 1;
      this.location.subtitle = 'The Magic City';
      this.location.image = '../../../assets/images/location-miami.jpg';
      this.location.venue = 'Marriott Miami Airport';
      this.location.venueImage = '../../../assets/images/venue-miami.jpg';
      this.location.venueSubtitle = '1201 NW LeJeune Rd Building A\nMiami, FL 33126';
      this.location.venueDates = 'Training waves at this location will be held on March 4, 5 & 6. If one of these dates does not appear as an option while you are registering, it is likely full, so please select a different date.';
    } else if (city === 'Irving, TX') {
      this.location.id = 2;
      this.location.subtitle = 'The heart of the Dallas / Fort Worth Metroplex';
      this.location.image = '../../../assets/images/location-irving.jpg';
      this.location.venue = 'Doubletree by Hilton DFW North';
      this.location.venueImage = '../../../assets/images/venue-irving.jpg';
      this.location.venueSubtitle = '4441 W John Carpenter Freeway\nIrving, TX 75063';
      this.location.venueDates = 'Training waves at this location will be held on March 6 & 7. If one of these dates does not appear as an option while you are registering, it is likely full, so please select a different date.';
    } else if (city === 'Rosemont, IL') {
      this.location.id = 3;
      this.location.subtitle = 'You Can\'t Miss It';
      this.location.image = '../../../assets/images/location-rosemont.jpg';
      this.location.venue = 'Sheraton Suites O’Hare Airport';
      this.location.venueImage = '../../../assets/images/venue-rosemont.jpg';
      this.location.venueSubtitle = '6501 Mannheim Rd\nRosemont, IL 60018';
      this.location.venueDates = 'Training waves at this location will be held on March 13 & 14. If one of these dates does not appear as an option while you are registering, it is likely full, so please select a different date.';
    } else if (city === 'Santa Ana, CA') {
      this.location.id = 4;
      this.location.subtitle = 'The Spirit of Change';
      this.location.image = '../../../assets/images/location-santa-ana.jpg';
      this.location.venue = 'Doubletree by Hilton Santa Ana – Orange County Airport';
      this.location.venueImage = '../../../assets/images/venue-santa-ana.jpg';
      this.location.venueSubtitle = '201 East MacArthur Blvd\nSanta Ana, CA 92707';
      this.location.venueDates = 'Training waves at this location will be held on March 13, 14, and 15. If one of these dates does not appear as an option while you are registering, it is likely full, so please select a different date.';
    } else if (city === 'Oakland, CA') {
      this.location.id = 5;
      this.location.subtitle = 'Bright Side of the Bay';
      this.location.image = '../../../assets/images/location-oakland.jpg';
      this.location.venue = 'Hilton Oakland Airport';
      this.location.venueImage = '../../../assets/images/venue-oakland.jpg';
      this.location.venueSubtitle = '1 Hegenberger Rd\nOakland, CA 94621';
      this.location.venueDates = 'Training waves at this location will be held on March 18, 19, and 20. If one of these dates does not appear as an option while you are registering, it is likely full, so please select a different date.';
    } else if (city === 'Mahwah, NJ') {
      this.location.id = 6;
      this.location.subtitle = 'Place Where Paths Meet';
      this.location.image = '../../../assets/images/location-mahwah.jpg';
      this.location.venue = 'Jaguar Land Rover North American Headquarters';
      this.location.venueImage = '../../../assets/images/venue-mahwah.jpg';
      this.location.venueSubtitle = '100 Jaguar Land Rover Way\nMahwah, NJ 07495';
      this.location.venueDates = 'Training waves at this location will be held on March 18, 19, 20 & 21. If one of these dates does not appear as an option while you are registering, it is likely full, so please select a different date.';
    } else if (city === 'Toronto, ON') {
      this.location.id = 7;
      this.location.subtitle = '';
      this.location.image = '../../../assets/images/location-toronto.jpg';
      this.location.venue = 'Hilton Garden Inn Toronto Airport';
      this.location.venueImage = '../../../assets/images/venue-toronto.jpg';
      this.location.venueSubtitle = '3311 Caroga Dr\nMississauga, ON L4V 1A3, Canada';
      this.location.venueDates = 'Training waves at this location will be held on April 2 & 3. If one of these dates does not appear as an option while you are registering, it is likely full, so please select a different date.';
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
