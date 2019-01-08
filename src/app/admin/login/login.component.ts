import { Component, OnInit } from '@angular/core';

import { FadeAnimation, TopDownAnimation } from '../../animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [ FadeAnimation, TopDownAnimation ]
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
