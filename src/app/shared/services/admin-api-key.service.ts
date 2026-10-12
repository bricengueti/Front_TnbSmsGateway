import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminApiKey, RoutingMode } from '../models/api.models';
import { ApiResponse } from '../models/common.models';

/**
 * Vue globale de toutes les clés API émises sur la plateforme (admin).
 * Vérifié contre le tag "Administration" du Swagger — intégration réelle.
 *
 *   GET  /admin/api-keys?routingMode   → AdminApiKeyResponse[]
 *   POST /admin/api-keys/{id}/revoke   → ApiResponse
 */
@Injectable({ providedIn: 'root' })
export class AdminApiKeyService {

  private readonly base = `${environment.apiUrl}/admin/api-keys`;

  constructor(private http: HttpClient) {}

  list(routingMode?: RoutingMode): Observable<AdminApiKey[]> {
    let params = new HttpParams();
    if (routingMode) params = params.set('routingMode', routingMode);
    return this.http.get<AdminApiKey[]>(this.base, { params });
  }

  revoke(id: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.base}/${id}/revoke`, {});
  }
}
