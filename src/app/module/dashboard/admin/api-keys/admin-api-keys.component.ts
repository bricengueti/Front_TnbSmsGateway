import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiBadgeComponent } from '../../../../shared/ui/badge/ui-badge.component';
import { UiAvatarComponent } from '../../../../shared/ui/avatar/ui-avatar.component';
import { UiMetricCardComponent } from '../../../../shared/ui/metric-card/ui-metric-card.component';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { AdminApiKeyService } from '../../../../shared/services/admin-api-key.service';
import { AdminApiKey, RoutingMode } from '../../../../shared/models/api.models';

@Component({
  selector: 'app-admin-api-keys',
  standalone: true,
  imports: [CommonModule, FormsModule, UiBadgeComponent, UiAvatarComponent, UiMetricCardComponent, RevealOnScrollDirective],
  templateUrl: './admin-api-keys.component.html',
  styleUrl: './admin-api-keys.component.scss'
})
export class AdminApiKeysComponent implements OnInit {

  keys = signal<AdminApiKey[]>([]);
  search = signal('');
  routingFilter = signal<'ALL' | RoutingMode>('ALL');

  constructor(private adminApiKeyService: AdminApiKeyService) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    const filter = this.routingFilter();
    const routingMode = filter === 'ALL' ? undefined : filter;
    this.adminApiKeyService.list(routingMode).subscribe(keys => this.keys.set(keys));
  }

  setFilter(f: 'ALL' | RoutingMode) {
    this.routingFilter.set(f);
    this.refresh();
  }

  get filteredKeys(): AdminApiKey[] {
    const q = this.search().toLowerCase().trim();
    if (!q) return this.keys();
    return this.keys().filter(k => k.label.toLowerCase().includes(q) || k.ownerEmail.toLowerCase().includes(q));
  }

  get activeCount() { return this.keys().filter(k => !k.revoked).length; }

  revoke(id: string) {
    this.adminApiKeyService.revoke(id).subscribe(() => this.refresh());
  }
}
