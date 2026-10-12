// Environnement de recette. ⚠️ URL À REMPLACER dès qu'un serveur staging
// existe — voir dashboard-routing / README pour la procédure de bascule.
// Activé via `ng serve --configuration staging` ou `ng build --configuration staging`.
export const environment = {
  envName: 'staging',
  production: false,
  apiUrl: 'https://staging-api.tnbsmsgateway.com/api', // TODO: remplacer par la vraie URL staging
  accessTokenTtlMs: 12 * 60 * 60 * 1000,
  enableHttpLogging: true
};
