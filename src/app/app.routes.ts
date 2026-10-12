import { Routes } from '@angular/router';
import { WebSiteLayoutComponent } from './core/layout/web-site-layout/web-site-layout.component';
import { DasboardLayoutComponent } from './core/layout/dasboard-layout/dasboard-layout.component';
import { PageNotFoundComponent } from './shared/component/page-not-found/page-not-found.component';
import { LoginComponent } from './module/auth/login/login.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
   {
    path: '',
    component: WebSiteLayoutComponent,
    loadChildren: () => import('./core/route/web-site-routing'),
    data: { module: 'base' }
  },
  // /register alias vers /login : le flow OTP crée le compte automatiquement
  // à la première vérification (voir AuthResponse.isNewAccount) — un seul
  // écran suffit pour les deux intentions.
  { path: 'login', component: LoginComponent, data: { module: 'auth' } },
  { path: 'register', component: LoginComponent, data: { module: 'auth' } },
  {
    path: 'dashboard',
    component: DasboardLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () => import('./core/route/dashboard-routing'),
    data: { module: 'account' }
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
