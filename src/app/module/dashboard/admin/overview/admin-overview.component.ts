import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiMetricCardComponent } from '../../../../shared/ui/metric-card/ui-metric-card.component';
import { UiBadgeComponent } from '../../../../shared/ui/badge/ui-badge.component';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { AdminOverviewService } from '../../../../shared/services/admin-overview.service';
import { AdminDeviceService } from '../../../../shared/services/admin-device.service';
import { AdminDevice, AdminStats } from '../../../../shared/models/api.models';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, UiMetricCardComponent, UiBadgeComponent, RevealOnScrollDirective],
  templateUrl: './admin-overview.component.html',
  styleUrl: './admin-overview.component.scss'
})
export class AdminOverviewComponent implements OnInit {

  stats = signal<AdminStats | null>(null);
  offlineDevices = signal<AdminDevice[]>([]);

  constructor(
    private adminOverviewService: AdminOverviewService,
    private adminDeviceService: AdminDeviceService
  ) {}

  ngOnInit() {
    this.adminOverviewService.stats().subscribe(s => this.stats.set(s));
    // Donnée réelle : GET /admin/devices?status=OFFLINE existe bel et bien.
    this.adminDeviceService.list(undefined, 'OFFLINE').subscribe(d => this.offlineDevices.set(d));
  }
}
