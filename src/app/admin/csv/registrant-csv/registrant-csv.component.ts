import { Component, Input, Renderer } from '@angular/core';
import { DatePipe } from '@angular/common';

import * as moment from 'moment';

class DateTimePipe extends DatePipe {
  public transform(value): any {
    return super.transform(value, 'MMMM d, y, h:mm:ss a');
  }
}

import { Registrant } from '../../../services/classes';

@Component({
  selector: 'app-registrant-csv',
  templateUrl: './registrant-csv.component.html',
  styleUrls: ['./registrant-csv.component.scss']
})
export class RegistrantCsvComponent {
  @Input() data: Registrant[];
  headers: string[] = [];
  fileName = 'registrant-data-' + Date.now() + '.csv';
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
      first_name: '',
      last_name: '',
      email: '',
      jlr_id: '',
      job: '',
      retailer: '',
      retailer_code: '',
      region_number: '',
      region: '',
      market: '',
      hotel: '',
      wave: '',
      diet: '',
      special: '',
      created: '',
      modified: ''
    };
    const keys = Object.keys(headerObj);
    this.headers = [
      'First Name',
      'Last Name',
      'Email',
      'Training ID',
      'Job Title',
      'Retailer',
      'Retailer Code',
      'Region Number',
      'Region',
      'Market',
      'Hotel',
      'Wave',
      'Dietary Restrictions',
      'Special Needs',
      'Created Date',
      'Modified Date'
    ];

    this.headers.forEach(h => {
      tabText += '"' + h + '",';
    });

    if (tabText.length > 0) {
      tabText = tabText.slice(0, -1);
      tabText += '\r\n';
    }

    this.data.sort((a, b) => {
      const x = a['modified'];
      const y = b['modified'];
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    }).forEach(d => {
      keys.forEach(k => {
        if (d.hasOwnProperty(k) && d[k] != null) {
          if (moment(d[k], moment.ISO_8601, true).isValid()) {
            const pipe = new DateTimePipe('en-US');
            tabText += '"' + pipe.transform(d[k]) + '",';
          } else {
            tabText += '"' + d[k] + '",';
          }
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
