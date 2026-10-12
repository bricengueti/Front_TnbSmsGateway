import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminUserDetail, AdminUserSummary, PlanType, UserQuota, UserStatus } from '../models/api.models';

export interface QuotaOverridePayload {
  unlimited?: boolean;
  smsQuota?: number;         // type=POOL — total pour toute la période
  quantityDevices?: number;  // type=PERSONAL
  resetCounter?: boolean;    // remet le compteur consommé à zéro SANS changer l'expiration
  periodEndsAt?: string;     // ISO 8601 — geste commercial pour prolonger un pack
}

/**
 * Administration des comptes utilisateurs (plateforme entière).
 * Vérifié contre le patch backend du 11/08/2026 (AdminQuotaService,
 * QuotaOverrideRequest) — modèle à durée de validité, plus de reset mensuel.
 *
 *   GET   /admin/users                                    → AdminUserResponse[]
 *   GET   /admin/users/{id}                                → AdminUserDetailResponse
 *   PATCH /admin/users/{id}/status   body: {status}         → AdminUserResponse
 *   POST  /admin/users/{userId}/quota/pool/assign-plan      body: {planId} → UserQuotaResponse
 *   POST  /admin/users/{userId}/quota/personal/assign-plan  body: {planId} → UserQuotaResponse
 *   PATCH /admin/users/{userId}/quota/{type}/override       body: QuotaOverrideRequest → UserQuotaResponse
 */
@Injectable({ providedIn: 'root' })
export class AdminUserService {

  private readonly base = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient) {}

  list(): Observable<AdminUserSummary[]> {
    return this.http.get<AdminUserSummary[]>(this.base);
  }

  get(id: string): Observable<AdminUserDetail> {
    return this.http.get<AdminUserDetail>(`${this.base}/${id}`);
  }

  updateStatus(id: string, status: UserStatus): Observable<AdminUserSummary> {
    return this.http.patch<AdminUserSummary>(`${this.base}/${id}/status`, { status });
  }

  assignPoolPlan(userId: string, planId: string): Observable<UserQuota> {
    return this.http.post<UserQuota>(`${this.base}/${userId}/quota/pool/assign-plan`, { planId });
  }

  assignPersonalPlan(userId: string, planId: string): Observable<UserQuota> {
    return this.http.post<UserQuota>(`${this.base}/${userId}/quota/personal/assign-plan`, { planId });
  }

  overrideQuota(userId: string, type: PlanType, payload: QuotaOverridePayload): Observable<UserQuota> {
    return this.http.patch<UserQuota>(`${this.base}/${userId}/quota/${type}/override`, payload);
  }
}
