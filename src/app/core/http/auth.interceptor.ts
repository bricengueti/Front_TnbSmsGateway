import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

// Endpoints d'authentification eux-mêmes : jamais de header Authorization
// dessus, et jamais de tentative de refresh en cas de 401 (boucle infinie sinon).
const AUTH_ENDPOINTS = ['/v1/auth/otp/request', '/v1/auth/otp/verify', '/v1/auth/refresh'];

/**
 * Attache le JWT (Authorization: Bearer <token>) à chaque requête sortante
 * vers l'API TNB. Sur un 401, tente un refresh silencieux une seule fois
 * puis rejoue la requête d'origine ; si le refresh échoue, déconnecte et
 * redirige vers /login en conservant l'URL de retour.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isApiRequest = req.url.startsWith(environment.apiUrl);
  const isAuthEndpoint = AUTH_ENDPOINTS.some(path => req.url.includes(path));

  const token = authService.accessToken();
  const authorizedReq = (isApiRequest && !isAuthEndpoint && token)
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authorizedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const shouldAttemptRefresh = error.status === 401 && isApiRequest && !isAuthEndpoint && !!authService.refreshTokenValue();

      if (!shouldAttemptRefresh) {
        return throwError(() => error);
      }

      return authService.refresh().pipe(
        switchMap(refreshed => {
          const retriedReq = req.clone({ setHeaders: { Authorization: `Bearer ${refreshed.accessToken}` } });
          return next(retriedReq);
        }),
        catchError(refreshError => {
          router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
          return throwError(() => refreshError);
        })
      );
    })
  );
};
