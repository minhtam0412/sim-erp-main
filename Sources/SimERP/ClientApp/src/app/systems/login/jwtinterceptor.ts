import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {AuthenService} from '../authen.service';
import {catchError, filter, finalize, switchMap, take, tap} from 'rxjs/operators';
import {throwError} from 'rxjs/internal/observable/throwError';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {ResponeResult} from '../../common/commomodel/ResponeResult';
import {LoaderService} from '../../common/loading/loader.service';
import {CookieService} from 'ngx-cookie-service';
import {Key_UserInfo} from '../../common/config/globalconfig';
import {Router} from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authenService: AuthenService, private loaderService: LoaderService, private cookieService: CookieService,
              private router: Router) {
  }

  private onStart(url: string) {
    this.loaderService.onRequestStart();
  }

  private onEnd(url: string): void {
    this.loaderService.onRequestEnd();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      this.onStart(request.url);
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.onEnd(event.url);
        }
      }),
      catchError(error => {
        let errorMessage = '';
        if (error instanceof HttpErrorResponse && error.status === 401) {
          errorMessage = 'Error: Request is not authorization';
          console.log(errorMessage);
          return this.handle401Error(request, next);
        } else {
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.message}`;
          } else {
            // server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          }
          console.log(errorMessage);
          return throwError(errorMessage);
        }
      }),
      finalize(() => {
      }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authenService.refreshToken().pipe(
        switchMap((res: ResponeResult) => {
          if (res && res.IsOk) {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(res);
            this.cookieService.set(Key_UserInfo, JSON.stringify(res.RepData), null);
            return next.handle(request);
          } else {
            this.router.navigate(['/login']);
          }

        }));
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(request);
        }));
    }
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}
