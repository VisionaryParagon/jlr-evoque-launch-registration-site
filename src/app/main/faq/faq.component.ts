import { Component, OnInit } from '@angular/core';

import { FadeAnimation } from '../../animations';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  animations: [ FadeAnimation ]
})
export class FaqComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
