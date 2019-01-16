import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

import { Registrant, Retailer, Options } from './classes';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private regUrl = '/reg/registrants';
  currentRegistrant: Registrant = new Registrant();
  currentRetailer: Retailer = new Retailer();
  returnUrl: string;
  state = {
    loggedIn: false
  };

  constructor(
    private http: HttpClient
  ) { }

  // login registrant
  loginRegistrant(data) {
    return this.http.post<any>(this.regUrl + '/login', data)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // verify registrant ID
  verifyId(data) {
    return this.http.post<any>(this.regUrl + '/verify', data)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // get loggedIn status
  getLoginStatus() {
    return this.state.loggedIn;
  }

  // set loggedIn status
  setLoginStatus(status) {
    this.state.loggedIn = status;
  }

  // get current registrant
  getCurrentRegistrant() {
    return this.currentRegistrant;
  }

  // set current registrant
  setCurrentRegistrant(data) {
    this.setLoginStatus(true);

    if (data._id) {
      this.currentRegistrant = data;
    } else if (data.registrant._id) {
      this.currentRegistrant = data.registrant;
      this.currentRetailer = data.retailer;
    } else {
      // assign employee data
      for (const prop in data.employee) {
        if (data.employee.hasOwnProperty(prop)) {
          if (prop !== '_id') {
            this.currentRegistrant[prop] = data.employee[prop];
          }
        }
      }

      // assign retailer data
      this.currentRetailer = data.retailer;

      for (const prop in data.retailer) {
        if (data.retailer.hasOwnProperty(prop) && this.currentRegistrant.hasOwnProperty(prop)) {
          if (prop !== '_id') {
            this.currentRegistrant[prop] = data.retailer[prop];
          }
        }
      }
    }
  }

  // clear current registrant
  clearCurrentRegistrant() {
    this.currentRegistrant = new Registrant();
    this.currentRetailer = new Retailer();
    this.setLoginStatus(false);
  }

  // get current retailer
  getCurrentRetailer() {
    return this.currentRetailer;
  }

  // get registration form options
  getOptions() {
    return this.http.get<Options>(this.regUrl + '/options')
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // get wave caps
  getCaps(data) {
    return this.http.post<any>(this.regUrl + '/caps', data)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // create new registrant
  createRegistrant(data) {
    return this.http.post<Registrant>(this.regUrl, data)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // get all registrants
  getRegistrants() {
    return this.http.get<Registrant[]>(this.regUrl)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // get one registrant
  getRegistrant(data) {
    const idUrl = this.regUrl + '/' + data;
    return this.http.get<Registrant>(idUrl)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // delete registrant
  deleteRegistrant(data) {
    const idUrl = this.regUrl + '/' + data._id;
    return this.http.delete(idUrl)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // update registrant
  updateRegistrant(data) {
    const idUrl = this.regUrl + '/' + data._id;
    const updated = data;
    updated.modified = new Date();
    return this.http.put<Registrant>(idUrl, updated)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.message}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'An error occurred; please try again later.');
  }
}
