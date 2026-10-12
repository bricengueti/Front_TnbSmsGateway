import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Protège /dashboard/admin/** — redirige un compte non-admin vers son
 * propre dashboard client plutôt que de simplement bloquer l'accès, pour
 * une meilleure expérience que du "403 sec".
 */
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) return true;

  router.navigate(['/dashboard/client/overview']);
  return false;
};
