import { Component, Input, Renderer } from '@angular/core';

import { Employee } from '../../../services/classes';

@Component({
  selector: 'app-employee-csv',
  templateUrl: './employee-csv.component.html',
  styleUrls: ['./employee-csv.component.scss']
})
export class EmployeeCsvComponent {
  @Input() data: Employee[];
  headers: string[] = [];
  fileName = 'employee-data-' + Date.now() + '.csv';
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
      region_number: ''
    };
    const keys = Object.keys(headerObj);
    this.headers = [
      'First Name',
      'Last Name',
      'Email',
      'Training ID',
      'Job Title',
      'Retailer',
      'Region Number'
    ];

    this.headers.forEach(h => {
      tabText += '"' + h + '",';
    });

    if (tabText.length > 0) {
      tabText = tabText.slice(0, -1);
      tabText += '\r\n';
    }

    this.data.sort((a, b) => {
      const x = a['last_name'];
      const y = b['last_name'];
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
