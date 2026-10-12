import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/notifications/notification.service';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-host.component.html',
  styleUrl: './toast-host.component.scss'
})
export class ToastHostComponent {
  notifications = inject(NotificationService);

  iconFor(tone: string): string {
    if (tone === 'success') return 'check_circle';
    if (tone === 'error') return 'error';
    return 'info';
  }
}
