import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminDevice, DeviceStatus, DeviceType } from '../models/api.models';
import { ApiResponse } from '../models/common.models';

/**
 * Supervision de la flotte de devices toutes plateformes confondues.
 * Vérifié contre le tag "Administration" du Swagger — intégration réelle.
 *
 *   GET   /admin/devices?type&status              → AdminDeviceResponse[]
 *   POST  /admin/devices/{id}/revoke                → ApiResponse
 *   PATCH /admin/devices/{id}/pool-fallback  body: {enabled} → AdminDeviceResponse
 */
@Injectable({ providedIn: 'root' })
export class AdminDeviceService {

  private readonly base = `${environment.apiUrl}/admin/devices`;

  constructor(private http: HttpClient) {}

  list(type?: DeviceType, status?: DeviceStatus): Observable<AdminDevice[]> {
    let params = new HttpParams();
    if (type) params = params.set('type', type);
    if (status) params = params.set('status', status);
    return this.http.get<AdminDevice[]>(this.base, { params });
  }

  revoke(id: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.base}/${id}/revoke`, {});
  }

  setPoolFallback(id: string, enabled: boolean): Observable<AdminDevice> {
    return this.http.patch<AdminDevice>(`${this.base}/${id}/pool-fallback`, { enabled });
  }
}
