import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DeviceType } from '../models/api.models';

export interface IntegrationActivationResult {
  apiKeyId: string | null;
  apiKey: string | null;        // AFFICHÉ UNE SEULE FOIS
  apiKeyPrefix: string | null;
  pairingCode: string;          // AFFICHÉ UNE SEULE FOIS
  targetType: DeviceType;
}

export interface PairingCodeResult {
  pairingCode: string; // AFFICHÉ UNE SEULE FOIS
}

/**
 * Génère les codes de connexion (et clés API) utilisés pour pairer des
 * devices Android. Vérifié contre le tag "Intégration" du Swagger.
 *
 *   POST /v1/integration/activate                         body: {apiKeyLabel?, targetType?, withApiKey?} → IntegrationActivationResponse
 *   POST /v1/integration/pairing-code/regenerate?targetType → PairingCodeResponse
 */
@Injectable({ providedIn: 'root' })
export class IntegrationService {

  private readonly base = `${environment.apiUrl}/v1/integration`;

  constructor(private http: HttpClient) {}

  activate(targetType: DeviceType = 'PERSONAL', withApiKey = false, apiKeyLabel?: string): Observable<IntegrationActivationResult> {
    return this.http.post<IntegrationActivationResult>(`${this.base}/activate`, {
      targetType, withApiKey, apiKeyLabel
    });
  }

  regeneratePairingCode(targetType: DeviceType = 'PERSONAL'): Observable<PairingCodeResult> {
    return this.http.post<PairingCodeResult>(`${this.base}/pairing-code/regenerate`, null, {
      params: { targetType }
    });
  }
}
