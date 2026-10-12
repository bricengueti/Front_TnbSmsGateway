import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiKey, ApiKeyScope, RoutingMode } from '../models/api.models';
import { ApiResponse } from '../models/common.models';

/**
 * Gère les clés API du compte connecté (dashboard client).
 * Vérifié contre le tag "Clés API" du Swagger — intégration réelle.
 *
 *   POST   /v1/api-keys        body: {label,scope,routingMode} → 200 ApiKeyResponse
 *   GET    /v1/api-keys        → 200 ApiKeyResponse[]
 *   DELETE /v1/api-keys/{id}   → 200 ApiResponse
 */
@Injectable({ providedIn: 'root' })
export class ApiKeyService {

  private readonly base = `${environment.apiUrl}/v1/api-keys`;

  constructor(private http: HttpClient) {}

  list(): Observable<ApiKey[]> {
    return this.http.get<ApiKey[]>(this.base);
  }

  create(label: string, scope: ApiKeyScope, routingMode: RoutingMode): Observable<ApiKey> {
    return this.http.post<ApiKey>(this.base, { label, scope, routingMode });
  }

  revoke(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.base}/${id}`);
  }
}
