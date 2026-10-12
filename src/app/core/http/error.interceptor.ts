import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../notifications/notification.service';
import { environment } from '../../../environments/environment';

/**
 * Gestion d'erreur globale pour toutes les requêtes vers l'API TNB.
 * Extrait le message lisible du corps ApiResponse{message, success} quand
 * il est présent, sinon retombe sur un message générique par code HTTP.
 * Le 401 n'est PAS traité ici (voir auth.interceptor.ts qui gère le
 * refresh) pour éviter d'afficher un toast d'erreur pendant un refresh
 * silencieux réussi.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);
  const isApiRequest = req.url.startsWith(environment.apiUrl);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (isApiRequest && error.status !== 401) {
        notifications.error(resolveMessage(error));
      }
      return throwError(() => error);
    })
  );
};

function resolveMessage(error: HttpErrorResponse): string {
  const body = error.error;
  if (body && typeof body === 'object' && typeof body.message === 'string') {
    return body.message;
  }
  switch (error.status) {
    case 0: return 'Impossible de joindre le serveur. Vérifiez votre connexion.';
    case 400: return 'Requête invalide.';
    case 403: return 'Action non autorisée.';
    case 404: return 'Ressource introuvable.';
    case 429: return 'Trop de tentatives — veuillez patienter.';
    case 500: return 'Erreur serveur. Réessayez plus tard.';
    default: return `Une erreur est survenue (${error.status}).`;
  }
}
