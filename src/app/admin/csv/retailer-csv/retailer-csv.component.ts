import { Component, Input, Renderer } from '@angular/core';

import { Retailer } from '../../../services/classes';

@Component({
  selector: 'app-retailer-csv',
  templateUrl: './retailer-csv.component.html',
  styleUrls: ['./retailer-csv.component.scss']
})
export class RetailerCsvComponent {
  @Input() data: Retailer[];
  headers: string[] = [];
  fileName = 'retailer-data-' + Date.now() + '.csv';
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
      retailer: '',
      hotel: '',
      seats: '',
      seats_remaining: '',
      rooms: '',
      rooms_remaining: '',
      retailer_code: '',
      region: '',
      market: '',
      waves: ''
    };
    const keys = Object.keys(headerObj);
    this.headers = [
      'Retailer',
      'Hotel',
      'Seats',
      'Seats Remaining',
      'Rooms',
      'Rooms Remaining',
      'Retailer Code',
      'Region',
      'Market',
      'Waves'
    ];

    this.headers.forEach(h => {
      tabText += '"' + h + '",';
    });

    if (tabText.length > 0) {
      tabText = tabText.slice(0, -1);
      tabText += '\r\n';
    }

    this.data.sort((a, b) => {
      const x = a['waves'][0];
      const y = b['waves'][0];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }).forEach(d => {
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
