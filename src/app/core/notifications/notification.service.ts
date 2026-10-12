import { Injectable, signal } from '@angular/core';

export type NotificationTone = 'success' | 'error' | 'info';

export interface AppNotification {
  id: number;
  tone: NotificationTone;
  message: string;
}

/**
 * Toasts globaux (succès/erreur/info), affichés par ToastHostComponent
 * monté une seule fois dans AppComponent. Utilisé par error.interceptor.ts
 * pour remonter les erreurs API de façon visible, et par les pages pour
 * confirmer des actions (ex: "Clé révoquée").
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 1;
  notifications = signal<AppNotification[]>([]);

  push(tone: NotificationTone, message: string, durationMs = 4500) {
    const id = this.nextId++;
    this.notifications.update(list => [...list, { id, tone, message }]);
    setTimeout(() => this.dismiss(id), durationMs);
  }

  success(message: string) { this.push('success', message); }
  error(message: string) { this.push('error', message); }
  info(message: string) { this.push('info', message); }

  dismiss(id: number) {
    this.notifications.update(list => list.filter(n => n.id !== id));
  }
}
