import { Component, HostListener, OnInit } from '@angular/core';

import { FadeAnimation } from '../../../animations';

@Component({
  selector: 'scroll-arrow',
  templateUrl: './scroll-arrow.component.html',
  styleUrls: ['./scroll-arrow.component.scss'],
  animations: [ FadeAnimation ]
})
export class ScrollArrowComponent implements OnInit {
  atTop = true;

  constructor() { }

  ngOnInit() {
    this.checkScroll();
  }

  @HostListener('window:scroll', ['$event']) onScroll(ev) {
    this.checkScroll();
  }

  scrollPage() {
    let scrl = window.innerHeight;
    if (window.innerWidth < 768) {
      scrl -= 48;
    } else {
      scrl -= 72;
    }
    console.log('scrolling to', scrl);
    window.scrollTo({top: scrl, left: 0, behavior: 'smooth'});
  }

  checkScroll() {
    this.atTop = window.scrollY > 100 ? false : true;
  }
}
