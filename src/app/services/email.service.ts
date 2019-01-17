import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  emailUrlRoot = '/eml/';

  constructor(
    private http: HttpClient
  ) { }

  // send contact form email
  sendContact(contact) {
    return this.http.post(this.emailUrlRoot + 'contact', contact)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // send confirmation email
  sendConfirmation(registrant) {
    return this.http.post(this.emailUrlRoot + 'confirmation', registrant)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // send updated confirmation email
  sendUpdated(registrant) {
    return this.http.post(this.emailUrlRoot + 'updated', registrant)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // send deleted confirmation email
  sendDeleted(registrant) {
    return this.http.post(this.emailUrlRoot + 'deleted', registrant)
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
    return throwError(error);
  }
}
