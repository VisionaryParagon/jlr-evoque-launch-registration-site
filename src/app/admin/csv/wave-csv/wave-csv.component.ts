import { Component, Input, Renderer } from '@angular/core';

import { Wave } from '../../../services/classes';

@Component({
  selector: 'app-wave-csv',
  templateUrl: './wave-csv.component.html',
  styleUrls: ['./wave-csv.component.scss']
})
export class WaveCsvComponent {
  @Input() data: Wave[];
  headers: string[] = [];
  fileName = 'wave-data-' + Date.now() + '.csv';
  loading = false;

  constructor(
    private renderer: Renderer
  ) { }

  build() {
    this.loading = true;

    if (!this.data.length) {
      console.error('Data not available.');
      alert('Data not available.');
      this.loading = false;
      return;
    }

    this.buildDownloader(this.construct());
  }

  private construct(): string {
    let tabText = '';
    const headerObj = {
      wave: '',
      seats: '',
      seats_remaining: '',
      rooms: '',
      rooms_remaining: ''
    };
    const keys = Object.keys(headerObj);
    this.headers = [
      'Wave',
      'Seats',
      'Seats Remaining',
      'Rooms',
      'Rooms Remaining'
    ];

    this.headers.forEach(h => {
      tabText += '"' + h + '",';
    });

    if (tabText.length > 0) {
      tabText = tabText.slice(0, -1);
      tabText += '\r\n';
    }

    this.data.forEach(d => {
      keys.forEach(k => {
        if (d.hasOwnProperty(k) && d[k] != null) {
          tabText += '"' + d[k] + '",';
        } else {
          tabText += '"",';
        }
      });

      tabText = tabText.slice(0, -1);
      tabText += '\r\n';
    });

    return tabText;
  }

  private buildDownloader(data) {
    const bomData = '\ufeff' + data;
    const csvData = new Blob([bomData], {type: 'text/csv;charset=UTF-8'});
    const csvUrl = window.URL.createObjectURL(csvData);
    const anchor = this.renderer.createElement(document.body, 'a');

    this.renderer.setElementStyle(anchor, 'visibility', 'hidden');
    this.renderer.setElementAttribute(anchor, 'href', csvUrl);
    this.renderer.setElementAttribute(anchor, 'target', '_blank');
    this.renderer.setElementAttribute(anchor, 'download', this.fileName);
    this.renderer.invokeElementMethod(anchor, 'click');
    this.renderer.invokeElementMethod(anchor, 'remove');
    this.loading = false;
  }
}
