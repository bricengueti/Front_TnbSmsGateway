import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './core/http/auth.interceptor';
import { errorInterceptor } from './core/http/error.interceptor';
import { httpLoggingInterceptor } from './core/http/http-logging.interceptor';

// Enregistre les données de la locale française — nécessaire pour tous les
// pipes DecimalPipe/CurrencyPipe/DatePipe utilisant 'fr' ou 'fr-FR' dans
// le dashboard et le site vitrine (formatage des nombres, dates, montants).
registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    // Ordre important : logging (observe tout) → auth (attache le token,
    // gère le refresh) → error (notifie les échecs restants).
    provideHttpClient(withInterceptors([httpLoggingInterceptor, authInterceptor, errorInterceptor]))
  ]
};
