import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

import { Employee } from './classes';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private empUrl = '/emp/employees';

  constructor(
    private http: HttpClient
  ) { }

  // create new employee
  createEmployee(data) {
    return this.http.post<Employee>(this.empUrl, data)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // get all employees
  getEmployees() {
    return this.http.get<Employee[]>(this.empUrl)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // get one employee
  getEmployee(data) {
    const idUrl = this.empUrl + '/' + data;
    return this.http.get<Employee>(idUrl)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // delete employee
  deleteEmployee(data) {
    const idUrl = this.empUrl + '/' + data._id;
    return this.http.delete(idUrl)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // update employee
  updateEmployee(data) {
    const idUrl = this.empUrl + '/' + data._id;
    return this.http.put<Employee>(idUrl, data)
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
