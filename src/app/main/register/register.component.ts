import { Component, OnInit } from '@angular/core';

import { FadeAnimation } from '../../animations';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [ FadeAnimation ]
})
export class RegisterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
