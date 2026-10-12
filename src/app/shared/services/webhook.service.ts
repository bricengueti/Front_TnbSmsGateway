import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WebhookConfig } from '../models/api.models';
import { ApiResponse } from '../models/common.models';

/**
 * Configuration du webhook SMS entrants du compte connecté.
 * Vérifié contre le tag "Webhook" du Swagger — intégration réelle.
 *
 * IMPORTANT : le backend ne gère qu'UN SEUL webhook, dédié aux SMS
 * entrants — pas de système d'événements multiples à cocher, pas
 * d'historique de livraison exposé par API.
 *
 *   GET  /v1/webhook               → { webhookUrl, webhookSecret (masqué), hasWebhook }
 *   PUT  /v1/webhook  body: {webhookUrl} → ApiResponse
 *   POST /v1/webhook/test          → { success: boolean, message: string }
 *   POST /v1/webhook/secret/rotate → { message, newSecret } (secret en clair, une seule fois)
 */
@Injectable({ providedIn: 'root' })
export class WebhookService {

  private readonly base = `${environment.apiUrl}/v1/webhook`;

  constructor(private http: HttpClient) {}

  getConfig(): Observable<WebhookConfig> {
    return this.http.get<WebhookConfig>(this.base);
  }

  save(webhookUrl: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.base, { webhookUrl });
  }

  rotateSecret(): Observable<{ message: string; newSecret: string }> {
    return this.http.post<{ message: string; newSecret: string }>(`${this.base}/secret/rotate`, {});
  }

  sendTestPing(): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.base}/test`, {});
  }
}
