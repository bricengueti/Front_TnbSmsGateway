import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiMetricCardComponent } from '../../../../shared/ui/metric-card/ui-metric-card.component';
import { UiBadgeComponent } from '../../../../shared/ui/badge/ui-badge.component';
import { UiProgressBarComponent } from '../../../../shared/ui/progress-bar/ui-progress-bar.component';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { MessageService } from '../../../../shared/services/message.service';
import { DeviceService } from '../../../../shared/services/device.service';
import { BillingService, MyQuota } from '../../../../shared/services/billing.service';
import { Message, MessageStats } from '../../../../shared/models/api.models';

@Component({
  selector: 'app-client-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, UiMetricCardComponent, UiBadgeComponent, UiProgressBarComponent, RevealOnScrollDirective],
  templateUrl: './client-overview.component.html',
  styleUrl: './client-overview.component.scss'
})
export class ClientOverviewComponent implements OnInit {

  stats = signal<MessageStats | null>(null);
  recentMessages = signal<Message[]>([]);
  devicesOnline = signal(0);
  devicesTotal = signal(0);
  quota = signal<MyQuota | null>(null);
  loading = signal(true);

  deliveryRate = computed(() => {
    const s = this.stats();
    if (!s || s.totalSent === 0) return 0;
    return Math.round((s.totalDelivered / s.totalSent) * 1000) / 10;
  });

  /** Quota mis en avant sur la vue d'ensemble : priorité au POOL (crédits
   * SMS, le plus parlant au quotidien) puis PERSONAL si POOL est absent. */
  featuredQuota = computed(() => this.quota()?.poolQuota ?? this.quota()?.personalQuota ?? null);

  featuredQuotaPercent = computed(() => {
    const q = this.featuredQuota();
    if (!q || q.unlimited) return 0;
    if (q.type === 'POOL' && q.smsQuota) {
      return Math.min(100, Math.round(((q.smsSentInPeriod ?? 0) / q.smsQuota) * 100));
    }
    if (q.type === 'PERSONAL' && q.quantityDevices) {
      return Math.min(100, Math.round(((q.currentDeviceCount ?? 0) / q.quantityDevices) * 100));
    }
    return 0;
  });

  constructor(
    private messageService: MessageService,
    private deviceService: DeviceService,
    private billingService: BillingService
  ) {}

  ngOnInit() {
    this.messageService.stats().subscribe(s => this.stats.set(s));
    this.messageService.list({ size: 5 }).subscribe(p => {
      this.recentMessages.set(p.data);
      this.loading.set(false);
    });
    this.deviceService.list().subscribe(devices => {
      this.devicesTotal.set(devices.length);
      this.devicesOnline.set(devices.filter(d => d.status === 'ONLINE').length);
    });
    this.billingService.myQuota().subscribe(q => this.quota.set(q));
  }

  statusTone(status: string): 'success' | 'warning' | 'error' | 'neutral' {
    switch (status) {
      case 'DELIVERED': return 'success';
      case 'SENT': case 'DISPATCHED': case 'PENDING': return 'warning';
      case 'FAILED': case 'EXPIRED': return 'error';
      default: return 'neutral';
    }
  }
}
