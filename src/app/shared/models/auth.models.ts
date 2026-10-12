// =========================================================================
// Modèles d'authentification — miroir exact du Swagger (tag "Authentification").
// =========================================================================

export interface AuthRequest {
  email: string;
}

export interface OtpResponse {
  message: string;
  email: string;
  expiresInMinutes: number;
}

export interface OtpRequest {
  email: string;
  code: string;
}

/**
 * Correspond à AuthResponse. Le champ `isAdmin` est une EXTENSION convenue
 * avec le backend (pas encore dans le Swagger fourni le 08/08/2026) — le
 * backend doit l'ajouter à la réponse de POST /v1/auth/otp/verify pour que
 * le frontend puisse distinguer un compte admin sans appel supplémentaire.
 * Tant que ce champ n'est pas présent, `isAdmin` sera `undefined` et
 * traité comme `false` par AuthService (voir isAdmin() dedans).
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  isNewAccount: boolean;
  isAdmin?: boolean;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

/** Utilisateur courant tel que stocké côté client après authentification. */
export interface CurrentUser {
  email: string;
  isAdmin: boolean;
}
