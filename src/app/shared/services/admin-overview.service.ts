import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminStats } from '../models/api.models';

/**
 * Statistiques globales plateforme (dashboard admin).
 * Vérifié contre le tag "Administration" du Swagger — intégration réelle.
 * Base réelle : /admin (PAS /v1/admin).
 *
 *   GET /admin/stats → AdminStatsResponse
 */
@Injectable({ providedIn: 'root' })
export class AdminOverviewService {

  private readonly base = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  stats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.base}/stats`);
  }
}
