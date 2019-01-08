import { Component, OnInit } from '@angular/core';

import { FadeAnimation } from '../../animations';

@Component({
  selector: 'app-registrants',
  templateUrl: './registrants.component.html',
  styleUrls: ['./registrants.component.scss'],
  animations: [ FadeAnimation ]
})
export class RegistrantsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
