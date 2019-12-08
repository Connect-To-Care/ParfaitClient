import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { APIService } from "../services/api.service";

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  constructor(private readonly apiService: APIService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        if (err.status === 401) {
          // auto logout if 401 response returned from api

          // remove user from local storage to log user out
          this.apiService.logOut();

          // Make sure we clear the server on logout
          location.reload(true);
        }
        console.log(err);
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
