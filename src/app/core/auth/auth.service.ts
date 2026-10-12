import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, CurrentUser, OtpResponse, RefreshResponse } from '../../shared/models/auth.models';

const ACCESS_TOKEN_KEY = 'tnb_access_token';
const REFRESH_TOKEN_KEY = 'tnb_refresh_token';
const IS_ADMIN_KEY = 'tnb_is_admin';
const EMAIL_KEY = 'tnb_user_email';

/**
 * Authentification OTP + gestion du cycle de vie des tokens JWT.
 * Vérifié contre le tag "Authentification" du Swagger.
 *
 * Routes réelles :
 *   POST /v1/auth/otp/request   body: AuthRequest{email}          → OtpResponse
 *   POST /v1/auth/otp/verify    body: OtpRequest{email,code}       → AuthResponse
 *   POST /v1/auth/refresh       body: RefreshRequest{refreshToken} → RefreshResponse
 *   POST /v1/auth/logout                                            → ApiResponse
 *
 * Stockage : localStorage (accessToken, refreshToken, email, isAdmin).
 * Le AuthInterceptor lit `accessToken()` pour attacher le header
 * Authorization sur chaque requête sortante vers environment.apiUrl.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly base = `${environment.apiUrl}/v1/auth`;

  private _accessToken = signal<string | null>(localStorage.getItem(ACCESS_TOKEN_KEY));
  private _refreshToken = signal<string | null>(localStorage.getItem(REFRESH_TOKEN_KEY));
  private _currentUser = signal<CurrentUser | null>(this.readStoredUser());

  accessToken = computed(() => this._accessToken());
  refreshTokenValue = computed(() => this._refreshToken());
  currentUser = computed(() => this._currentUser());
  isAuthenticated = computed(() => !!this._accessToken());
  isAdmin = computed(() => this._currentUser()?.isAdmin ?? false);

  constructor(private http: HttpClient) {}

  private readStoredUser(): CurrentUser | null {
    const email = localStorage.getItem(EMAIL_KEY);
    if (!email) return null;
    return { email, isAdmin: localStorage.getItem(IS_ADMIN_KEY) === 'true' };
  }

  requestOtp(email: string): Observable<OtpResponse> {
    return this.http.post<OtpResponse>(`${this.base}/otp/request`, { email });
  }

  verifyOtp(email: string, code: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/otp/verify`, { email, code }).pipe(
      tap(res => this.persistSession(email, res))
    );
  }

  /**
   * Utilise le refresh token pour obtenir un nouvel access token.
   * Appelé automatiquement par AuthInterceptor sur une réponse 401.
   */
  refresh(): Observable<RefreshResponse> {
    const refreshToken = this._refreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('Aucun refresh token disponible'));
    }
    return this.http.post<RefreshResponse>(`${this.base}/refresh`, { refreshToken }).pipe(
      tap(res => {
        this._accessToken.set(res.accessToken);
        localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
      }),
      catchError(err => {
        this.clearSession();
        return throwError(() => err);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.base}/logout`, {}).pipe(
      catchError(() => of(void 0)), // même si l'appel échoue, on nettoie la session localement
      tap(() => this.clearSession())
    );
  }

  private persistSession(email: string, res: AuthResponse) {
    const isAdmin = res.isAdmin ?? false;
    this._accessToken.set(res.accessToken);
    this._refreshToken.set(res.refreshToken);
    this._currentUser.set({ email, isAdmin });

    localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
    localStorage.setItem(EMAIL_KEY, email);
    localStorage.setItem(IS_ADMIN_KEY, String(isAdmin));
  }

  private clearSession() {
    this._accessToken.set(null);
    this._refreshToken.set(null);
    this._currentUser.set(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(IS_ADMIN_KEY);
  }
}
