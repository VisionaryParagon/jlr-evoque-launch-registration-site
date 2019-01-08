export class Registrant {
  _id?: string;
  jlr_id: string;
  first_name: string;
  last_name: string;
  email: string;
  job: string;
  retailer: string;
  retailer_code: string;
  region_number: string;
  region: string;
  market: string;
  hotel: boolean;
  seats: number;
  rooms: number;
  wave: string;
  diet?: string;
  special?: string;
  created?: Date;
  modified?: Date;

  constructor() {
    this.jlr_id = '';
    this.first_name = '';
    this.last_name = '';
    this.email = '';
    this.job = '';
    this.retailer = '';
    this.retailer_code = '';
    this.region_number = '';
    this.region = '';
    this.market = '';
    this.hotel = false;
    this.seats = 0;
    this.rooms = 0;
  }
}

export class Employee {
  _id?: string;
  jlr_id: string;
  first_name: string;
  last_name: string;
  email: string;
  job: string;
  retailer: string;
  region_number: string;
}

export class Retailer {
  _id?: string;
  retailer: string;
  hotel: boolean;
  seats: number;
  rooms: number;
  retailer_code: string;
  region: string;
  market: string;
  waves: string[];
}

export class Wave {
  _id?: string;
  wave: string;
  seats: number;
  rooms: number;
}

export class Contact {
  first_name: string;
  last_name: string;
  email: string;
  retailer: string;
  message: string;

  constructor() {
    this.first_name = '';
    this.last_name = '';
    this.email = '';
    this.retailer = '';
    this.message = '';
  }
}

export class Admin {
  username: string;
  password: string;
}
