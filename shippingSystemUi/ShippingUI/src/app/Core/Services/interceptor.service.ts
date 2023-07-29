import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService {
  constructor(private authService: AuthService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

      if (this.authService.isLoggedIn()) {
        const authToken = this.authService.getToken();
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      }

      return next.handle(request);
  }
}
