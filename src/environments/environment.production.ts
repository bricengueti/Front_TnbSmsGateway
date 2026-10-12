// Environnement de production. ⚠️ URL À REMPLACER avant toute mise en ligne
// réelle — voir dashboard-routing / README pour la procédure de bascule.
// Activé via `ng build --configuration production` (build par défaut de
// `ng build` sans argument, car "production" est déclaré comme
// configuration par défaut dans angular.json).
export const environment = {
  envName: 'production',
  production: true,
  apiUrl: 'https://api.tnbsmsgateway.com/api', // TODO: remplacer par la vraie URL production
  accessTokenTtlMs: 12 * 60 * 60 * 1000,
  enableHttpLogging: false
};
