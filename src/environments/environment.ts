// =========================================================================
// Environnement par défaut — utilisé par `ng serve` / `ng build` sans
// --configuration explicite. Reflète le développement local contre le
// backend de dev distant. Ne jamais committer de secrets ici : ce fichier
// ne contient que des URLs publiques.
// =========================================================================
export const environment = {
  envName: 'development',
  production: false,

  /** Base API — server.servlet.context-path=/api côté Spring Boot. */
  apiUrl: 'http://164.132.99.131:8070/api',

  /** Durée de vie de l'access token (doit rester alignée avec le backend). */
  accessTokenTtlMs: 12 * 60 * 60 * 1000, // 12h

  /** Active les logs HTTP verbeux dans la console (voir http-logging.interceptor.ts). */
  enableHttpLogging: true
};
