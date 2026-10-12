import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminPlan, PlanType } from '../models/api.models';
import { ApiResponse } from '../models/common.models';

export interface CreatePlanPayload {
  name: string;
  description?: string;
  type: PlanType;
  validityMonths: number;           // durée de validité du pack, en mois — obligatoire
  quantitySms?: number | null;      // POOL uniquement
  quantityDevices?: number | null;  // PERSONAL uniquement
  price?: number;
}

/**
 * Catalogue des packs tarifaires POOL / PERSONAL (dashboard admin).
 * Vérifié contre le patch backend du 11/08/2026 (Plan à durée de validité,
 * PlanService.createPlan/toResponse, PlanRequest/PlanResponse).
 *
 * Un pack a désormais une durée de validité (`validityMonths`, en mois)
 * plutôt qu'un cycle mensuel implicite. `deactivate` reste un vrai TOGGLE
 * bidirectionnel malgré son nom (`plan.active = !plan.active` côté service).
 *
 *   GET  /admin/plans                 → PlanResponse[]
 *   POST /admin/plans                 → PlanResponse
 *   POST /admin/plans/{id}/deactivate → ApiResponse (bascule active <-> inactive)
 */
@Injectable({ providedIn: 'root' })
export class AdminPlanService {

  private readonly base = `${environment.apiUrl}/admin/plans`;

  constructor(private http: HttpClient) {}

  list(): Observable<AdminPlan[]> {
    return this.http.get<AdminPlan[]>(this.base);
  }

  create(payload: CreatePlanPayload): Observable<AdminPlan> {
    return this.http.post<AdminPlan>(this.base, payload);
  }

  /** Bascule l'état actif/inactif du pack (toggle réel, voir note ci-dessus). */
  toggleActive(id: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.base}/${id}/deactivate`, {});
  }
}
