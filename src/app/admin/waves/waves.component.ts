import { Component, OnInit } from '@angular/core';

import { FadeAnimation } from '../../animations';

@Component({
  selector: 'app-waves',
  templateUrl: './waves.component.html',
  styleUrls: ['./waves.component.scss'],
  animations: [ FadeAnimation ]
})
export class WavesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
