import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Device, DeviceSim } from '../models/api.models';
import { ApiResponse } from '../models/common.models';

export interface DeviceUpdatePayload {
  label?: string;
  countryCode?: string;
}

export interface DeviceSimUpdatePayload {
  operatorCode?: string;
  isActive?: boolean;
  /** Un nombre en chaîne, ou "ILLIMITE". */
  dailyQuota?: string;
}

/**
 * Gère les devices BYOD du compte connecté (dashboard client).
 * Vérifié contre les tags "Devices" et "SIMs" du Swagger — intégration réelle.
 *
 *   GET    /v1/devices                              → DeviceResponse[]
 *   GET    /v1/devices/{id}                          → DeviceResponse
 *   PATCH  /v1/devices/{id}                          → DeviceResponse
 *   POST   /v1/devices/{id}/revoke                    → ApiResponse
 *   DELETE /v1/devices/{id}                            → ApiResponse
 *   GET    /v1/devices/{deviceId}/sims                 → DeviceSimResponse[]
 *   PATCH  /v1/devices/{deviceId}/sims/{simId}         → DeviceSimResponse
 */
@Injectable({ providedIn: 'root' })
export class DeviceService {

  private readonly base = `${environment.apiUrl}/v1/devices`;

  constructor(private http: HttpClient) {}

  list(): Observable<Device[]> {
    return this.http.get<Device[]>(this.base);
  }

  get(id: string): Observable<Device> {
    return this.http.get<Device>(`${this.base}/${id}`);
  }

  update(id: string, changes: DeviceUpdatePayload): Observable<Device> {
    return this.http.patch<Device>(`${this.base}/${id}`, changes);
  }

  revoke(id: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.base}/${id}/revoke`, {});
  }

  remove(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.base}/${id}`);
  }

  listSims(deviceId: string): Observable<DeviceSim[]> {
    return this.http.get<DeviceSim[]>(`${this.base}/${deviceId}/sims`);
  }

  updateSim(deviceId: string, simId: string, changes: DeviceSimUpdatePayload): Observable<DeviceSim> {
    return this.http.patch<DeviceSim>(`${this.base}/${deviceId}/sims/${simId}`, changes);
  }

  /** Cadence par défaut du device (délai anti-détection entre 2 SMS). */
  updatePacing(deviceId: string, minDelaySec: number, maxDelaySec: number): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.base}/${deviceId}/pacing`, { minDelaySec, maxDelaySec });
  }

  /** Surcharge de cadence pour une SIM précise (null retire la surcharge). */
  updateSimPacing(deviceId: string, simId: string, minDelaySec: number | null, maxDelaySec: number | null): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.base}/${deviceId}/sims/${simId}/pacing`, { minDelaySec, maxDelaySec });
  }
}
