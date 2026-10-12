import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Message, MessageStats } from '../models/api.models';
import { PageResponse } from '../models/common.models';

export interface MessageListParams {
  page?: number;
  size?: number;
  direction?: 'INBOUND' | 'OUTBOUND';
  status?: string;
  search?: string;
}

export interface SendTestPayload {
  to: string;
  body: string;
  countryCode: string;
  operator: string;
  priority?: 'NORMAL' | 'HIGH';
  idempotencyKey?: string;
}

export interface SendBulkPayload {
  messages: { to: string; body: string; countryCode: string; operator: string }[];
}

/**
 * Messages sortants/entrants du compte connecté.
 * Vérifié contre le tag "Messages" du Swagger — intégration réelle.
 *
 * ⚠️ Ces routes sont déclarées ApiKeyAuth-only dans le Swagger fourni.
 * Le backend doit accepter aussi BearerAuth pour que le dashboard (JWT)
 * puisse les appeler — accord passé avec l'équipe backend le 09/08/2026.
 *
 *   GET  /v1/messages?page&size&direction&status&search → PageResponse<MessageResponse>
 *   GET  /v1/messages/{id}                                → MessageResponse
 *   GET  /v1/messages/stats                                → MessageStatsResponse
 *   POST /v1/messages/send                                  → 202 MessageResponse
 *   POST /v1/messages/send-bulk                             → MessageResponse[]
 */
@Injectable({ providedIn: 'root' })
export class MessageService {

  private readonly base = `${environment.apiUrl}/v1/messages`;

  constructor(private http: HttpClient) {}

  stats(): Observable<MessageStats> {
    return this.http.get<MessageStats>(`${this.base}/stats`);
  }

  list(params: MessageListParams = {}): Observable<PageResponse<Message>> {
    let httpParams = new HttpParams();
    if (params.page !== undefined) httpParams = httpParams.set('page', params.page);
    if (params.size !== undefined) httpParams = httpParams.set('size', params.size);
    if (params.direction) httpParams = httpParams.set('direction', params.direction);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<PageResponse<Message>>(this.base, { params: httpParams });
  }

  get(id: string): Observable<Message> {
    return this.http.get<Message>(`${this.base}/${id}`);
  }

  send(payload: SendTestPayload): Observable<Message> {
    return this.http.post<Message>(`${this.base}/send`, payload);
  }

  sendBulk(payload: SendBulkPayload): Observable<Message[]> {
    return this.http.post<Message[]>(`${this.base}/send-bulk`, payload);
  }
}
