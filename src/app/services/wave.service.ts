import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

import { Wave } from './classes';

@Injectable({
  providedIn: 'root'
})
export class WaveService {
  private waveUrl = '/wvs/waves';

  constructor(
    private http: HttpClient
  ) { }

  // create new wave
  createWave(data) {
    return this.http.post<Wave>(this.waveUrl, data)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // get all waves
  getWaves() {
    return this.http.get<Wave[]>(this.waveUrl)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // get one wave
  getWave(data) {
    const idUrl = this.waveUrl + '/' + data;
    return this.http.get<Wave>(idUrl)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // delete wave
  deleteWave(data) {
    const idUrl = this.waveUrl + '/' + data._id;
    return this.http.delete(idUrl)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // update wave
  updateWave(data) {
    const idUrl = this.waveUrl + '/' + data._id;
    return this.http.put<Wave>(idUrl, data)
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
