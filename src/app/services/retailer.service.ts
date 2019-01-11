import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

import { Retailer } from './classes';

@Injectable({
  providedIn: 'root'
})
export class RetailerService {
  private retailerUrl = '/ret/retailers';

  constructor(
    private http: HttpClient
  ) { }

  // create new retailer
  createRetailer(data) {
    return this.http.post<Retailer>(this.retailerUrl, data)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // get all retailers
  getRetailers() {
    return this.http.get<Retailer[]>(this.retailerUrl)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // get one retailer
  getRetailer(data) {
    const idUrl = this.retailerUrl + '/' + data;
    return this.http.get<Retailer>(idUrl)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // delete retailer
  deleteRetailer(data) {
    const idUrl = this.retailerUrl + '/' + data._id;
    return this.http.delete(idUrl)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // update retailer
  updateRetailer(data) {
    const idUrl = this.retailerUrl + '/' + data._id;
    return this.http.put<Retailer>(idUrl, data)
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
