import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Log discret des requêtes API dans la console, actif uniquement quand
 * environment.enableHttpLogging=true (dev/staging). Utile pour vérifier
 * en un coup d'œil quelle route réelle est appelée pendant l'intégration.
 */
export const httpLoggingInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.enableHttpLogging || !req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const started = performance.now();
  // eslint-disable-next-line no-console
  console.debug(`→ ${req.method} ${req.url}`);

  return next(req).pipe(
    tap({
      next: (event: any) => {
        if (event?.status !== undefined) {
          const ms = Math.round(performance.now() - started);
          // eslint-disable-next-line no-console
          console.debug(`← ${req.method} ${req.url} [${event.status}] ${ms}ms`);
        }
      },
      error: (err) => {
        const ms = Math.round(performance.now() - started);
        // eslint-disable-next-line no-console
        console.debug(`✗ ${req.method} ${req.url} [${err.status}] ${ms}ms`);
      }
    })
  );
};
