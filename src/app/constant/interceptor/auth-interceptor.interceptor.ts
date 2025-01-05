import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../core/auth/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken');
  const toastService  = inject(ToastrService);
  const authService  = inject(AuthService);
  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(clonedReq) .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg: string;

        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
        }

        switch (error.status) {
          case 401:
            toastService.error('Server not responding, please check again later!');
            authService.logout();
            break;
          case 0:
            toastService.error('Server not responding, please check again later!');
            break;
          case 429:
            toastService.error('Too many requests, please check again later!');
            authService.logout();
            break;
          default:
            toastService.error('Something unexpected happened!');
        }

        console.error("errorMsg", errorMsg); 
        return throwError(() => new Error(errorMsg));
      }),
      
    );;
  }
  return next(req);
};