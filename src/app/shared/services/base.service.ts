import { environment } from '../../../environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';

export class BaseService<T> {
  protected _http = inject(HttpClient);
  protected resourceEndpoint: string = '/resources';
  basePath: string = `${environment.serverBasePath}`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
    }),
  };

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log(`An error occurred ${error.error.message}`);
    } else {
      console.log(`Backend returned code ${error.status}, body was ${error}`);
    }
    return throwError(
      () =>
        new Error('Something happened with request. Please try again later.')
    );
  }

  public resourcePath() {
    return `${this.basePath}${this.resourceEndpoint}`;
  }

  create(item: any): Observable<T> {
    return this._http
      .post<T>(this.resourcePath(), JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getById(id: string): Observable<T> {
    return this._http
      .get<T>(this.resourcePath() + `/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  delete(id: any) {
    return this._http
      .delete(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  update(id: any, item: any) {
    return this._http
      .put<T>(
        `${this.resourcePath()}/${id}`,
        JSON.stringify(item),
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  getAll() {
    return this._http
      .get<T[]>(this.resourcePath(), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getAllByQuery(queryParams: { [key: string]: any }) {
    let params = new HttpParams();

    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key] !== undefined && queryParams[key] !== null) {
        params = params.set(key, queryParams[key]);
      }
    });

    return this._http
      .get<T[]>(this.resourcePath(), { params, ...this.httpOptions })
      .pipe(retry(2), catchError(this.handleError));
  }
}
