import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminPlan, PaymentInitiation, UserQuota } from '../models/api.models';

export interface MyQuota {
  poolQuota: UserQuota | null;
  personalQuota: UserQuota | null;
}

/**
 * Achat de packs et consultation du quota du compte connecté.
 * Vérifié contre le code source réel de PurchaseController le 09/08/2026,
 * complété par le nouvel endpoint auto-service /v1/me/quota (voir
 * MeController.java + AdminQuotaService.getUserQuotaOrNull, fournis à
 * l'équipe backend le 10/08/2026 — à déployer côté serveur).
 *
 *   GET  /v1/purchases/plans     → PlanResponse[] (tous les packs, actifs
 *        ET inactifs — le filtrage sur `active` se fait côté frontend)
 *   POST /v1/purchases/{planId}  → PaymentInitiationResult{providerReference, paymentUrl}
 *   GET  /v1/me/quota             → { poolQuota, personalQuota } (null si jamais assigné)
 */
@Injectable({ providedIn: 'root' })
export class BillingService {

  private readonly purchasesBase = `${environment.apiUrl}/v1/purchases`;
  private readonly meBase = `${environment.apiUrl}/v1/me`;

  constructor(private http: HttpClient) {}

  listPlans(): Observable<AdminPlan[]> {
    return this.http.get<AdminPlan[]>(`${this.purchasesBase}/plans`);
  }

  purchasePlan(planId: string): Observable<PaymentInitiation> {
    return this.http.post<PaymentInitiation>(`${this.purchasesBase}/${planId}`, {});
  }

  myQuota(): Observable<MyQuota> {
    return this.http.get<MyQuota>(`${this.meBase}/quota`);
  }
}
