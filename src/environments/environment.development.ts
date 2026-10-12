// Explicitement sélectionné via `ng serve --configuration development`
// ou `ng build --configuration development`. Identique à environment.ts
// aujourd'hui (le backend dev est le seul environnement existant) — les
// deux fichiers sont volontairement séparés pour que l'environnement par
// défaut et l'environnement "development" nommé puissent diverger plus
// tard sans surprise (ex: si un jour `environment.ts` doit pointer vers
// un mock local plutôt que vers le serveur de dev distant).
export const environment = {
  envName: 'development',
  production: false,
  apiUrl: 'http://164.132.99.131:8070/api',
  accessTokenTtlMs: 12 * 60 * 60 * 1000,
  enableHttpLogging: true
};
