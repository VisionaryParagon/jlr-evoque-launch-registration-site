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
  venueInfo: string;
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

    if (city === 'Irving, TX') {
      this.location.id = 0;
      this.location.subtitle = 'The heart of the Dallas / Fort Worth Metroplex';
      this.location.image = '../../../assets/images/location-irving.jpg';
      this.location.venue = 'Irving Venue Name';
      this.location.venueImage = '../../../assets/images/location-irving.jpg';
      this.location.venueSubtitle = 'Irving Venue Subtitle';
      this.location.venueInfo = 'Irving Venue Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt, eveniet. Cupiditate repellat saepe hic vel tempora ducimus quae illo! Quia dignissimos id dolores ut placeat voluptatibus sed aspernatur totam laborum!';
    } else if (city === 'Miami, FL') {
      this.location.id = 1;
      this.location.subtitle = 'The Magic City';
      this.location.image = '../../../assets/images/location-miami.jpg';
      this.location.venue = 'Miami Venue Name';
      this.location.venueImage = '../../../assets/images/location-miami.jpg';
      this.location.venueSubtitle = 'Miami Venue Subtitle';
      this.location.venueInfo = 'Miami Venue Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt, eveniet. Cupiditate repellat saepe hic vel tempora ducimus quae illo! Quia dignissimos id dolores ut placeat voluptatibus sed aspernatur totam laborum!';
    } else if (city === 'Rosemont, IL') {
      this.location.id = 2;
      this.location.subtitle = 'You Can\'t Miss It';
      this.location.image = '../../../assets/images/location-rosemont.jpg';
      this.location.venue = 'Rosemont Venue Name';
      this.location.venueImage = '../../../assets/images/location-rosemont.jpg';
      this.location.venueSubtitle = 'Rosemont Venue Subtitle';
      this.location.venueInfo = 'Rosemont Venue Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt, eveniet. Cupiditate repellat saepe hic vel tempora ducimus quae illo! Quia dignissimos id dolores ut placeat voluptatibus sed aspernatur totam laborum!';
    } else if (city === 'Santa Ana, CA') {
      this.location.id = 3;
      this.location.subtitle = 'The Spirit of Change';
      this.location.image = '../../../assets/images/location-santa-ana.jpg';
      this.location.venue = 'Santa Ana Venue Name';
      this.location.venueImage = '../../../assets/images/location-santa-ana.jpg';
      this.location.venueSubtitle = 'Santa Ana Venue Subtitle';
      this.location.venueInfo = 'Santa Ana Venue Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt, eveniet. Cupiditate repellat saepe hic vel tempora ducimus quae illo! Quia dignissimos id dolores ut placeat voluptatibus sed aspernatur totam laborum!';
    } else if (city === 'Oakland, CA') {
      this.location.id = 4;
      this.location.subtitle = 'Bright Side of the Bay';
      this.location.image = '../../../assets/images/location-oakland.jpg';
      this.location.venue = 'Oakland Venue Name';
      this.location.venueImage = '../../../assets/images/location-oakland.jpg';
      this.location.venueSubtitle = 'Oakland Venue Subtitle';
      this.location.venueInfo = 'Oakland Venue Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt, eveniet. Cupiditate repellat saepe hic vel tempora ducimus quae illo! Quia dignissimos id dolores ut placeat voluptatibus sed aspernatur totam laborum!';
    } else if (city === 'Mahwah, NJ') {
      this.location.id = 5;
      this.location.subtitle = 'Place Where Paths Meet';
      this.location.image = '../../../assets/images/location-mahwah.jpg';
      this.location.venue = 'Mahwah Venue Name';
      this.location.venueImage = '../../../assets/images/location-mahwah.jpg';
      this.location.venueSubtitle = 'Mahwah Venue Subtitle';
      this.location.venueInfo = 'Mahwah Venue Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt, eveniet. Cupiditate repellat saepe hic vel tempora ducimus quae illo! Quia dignissimos id dolores ut placeat voluptatibus sed aspernatur totam laborum!';
    } else if (city === 'Toronto, ON') {
      this.location.id = 6;
      this.location.subtitle = 'Hogtown';
      this.location.image = '../../../assets/images/location-toronto.jpg';
      this.location.venue = 'Toronto Venue Name';
      this.location.venueImage = '../../../assets/images/location-toronto.jpg';
      this.location.venueSubtitle = 'Toronto Venue Subtitle';
      this.location.venueInfo = 'Toronto Venue Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt, eveniet. Cupiditate repellat saepe hic vel tempora ducimus quae illo! Quia dignissimos id dolores ut placeat voluptatibus sed aspernatur totam laborum!';
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
