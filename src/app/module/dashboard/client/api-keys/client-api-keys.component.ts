import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiButtonComponent } from '../../../../shared/ui/button/ui-button.component';
import { UiBadgeComponent } from '../../../../shared/ui/badge/ui-badge.component';
import { UiMetricCardComponent } from '../../../../shared/ui/metric-card/ui-metric-card.component';
import { UiModalComponent } from '../../../../shared/ui/modal/ui-modal.component';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { ApiKeyService } from '../../../../shared/services/api-key.service';
import { ApiKey, RoutingMode, ApiKeyScope } from '../../../../shared/models/api.models';

@Component({
  selector: 'app-client-api-keys',
  standalone: true,
  imports: [CommonModule, FormsModule, UiButtonComponent, UiBadgeComponent, UiMetricCardComponent, UiModalComponent, RevealOnScrollDirective],
  templateUrl: './client-api-keys.component.html',
  styleUrl: './client-api-keys.component.scss'
})
export class ClientApiKeysComponent implements OnInit {

  keys = signal<ApiKey[]>([]);
  createModalOpen = signal(false);
  revealModalOpen = signal(false);
  createdKey = signal<ApiKey | null>(null);
  copied = signal(false);

  form = { label: '', scope: 'SEND_ONLY' as ApiKeyScope, routingMode: 'OWN_DEVICES' as RoutingMode };

  constructor(private apiKeyService: ApiKeyService) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.apiKeyService.list().subscribe(keys => this.keys.set(keys));
  }

  openCreate() {
    this.form = { label: '', scope: 'SEND_ONLY', routingMode: 'OWN_DEVICES' };
    this.createModalOpen.set(true);
  }

  submitCreate() {
    if (!this.form.label.trim()) return;
    this.apiKeyService.create(this.form.label, this.form.scope, this.form.routingMode).subscribe(created => {
      this.createModalOpen.set(false);
      this.createdKey.set(created);
      this.revealModalOpen.set(true);
      this.refresh();
    });
  }

  /** DELETE réel : la clé disparaît immédiatement de la liste (pas d'état "révoquée"). */
  revoke(id: string) {
    this.apiKeyService.revoke(id).subscribe(() => this.refresh());
  }

  async copyKey() {
    const key = this.createdKey()?.apiKey;
    if (!key) return;
    try {
      await navigator.clipboard.writeText(key);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1800);
    } catch { /* presse-papiers indisponible */ }
  }
}
