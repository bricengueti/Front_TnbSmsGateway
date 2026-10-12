import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { UiButtonComponent } from '../../../../shared/ui/button/ui-button.component';
import { UiBadgeComponent } from '../../../../shared/ui/badge/ui-badge.component';
import { UiMetricCardComponent } from '../../../../shared/ui/metric-card/ui-metric-card.component';
import { UiToggleSwitchComponent } from '../../../../shared/ui/toggle-switch/ui-toggle-switch.component';
import { UiModalComponent } from '../../../../shared/ui/modal/ui-modal.component';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { AdminDeviceService } from '../../../../shared/services/admin-device.service';
import { IntegrationService } from '../../../../shared/services/integration.service';
import { AdminDevice } from '../../../../shared/models/api.models';

@Component({
  selector: 'app-admin-devices',
  standalone: true,
  imports: [CommonModule, UiButtonComponent, UiBadgeComponent, UiMetricCardComponent, UiToggleSwitchComponent, UiModalComponent, RevealOnScrollDirective],
  templateUrl: './admin-devices.component.html',
  styleUrl: './admin-devices.component.scss'
})
export class AdminDevicesComponent implements OnInit {

  fleet = signal<AdminDevice[]>([]);

  // --- Génération de code de connexion POOL ---
  // Contrairement au dashboard client (PERSONAL uniquement), seul l'espace
  // admin peut générer un code de connexion POOL, pour onboarder des
  // devices contribuant au pool partagé de la plateforme.
  poolModalOpen = signal(false);
  generatingCode = signal(false);
  pairingCode = signal<string | null>(null);
  pairingError = signal<string | null>(null);
  alreadyActive = signal(false);

  constructor(
    private adminDeviceService: AdminDeviceService,
    private integrationService: IntegrationService
  ) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.adminDeviceService.list().subscribe(f => this.fleet.set(f));
  }

  get onlineCount() { return this.fleet().filter(d => d.status === 'ONLINE').length; }
  get poolCount() { return this.fleet().filter(d => d.type === 'POOL').length; }
  get revokedCount() { return this.fleet().filter(d => d.revoked).length; }

  statusTone(status: AdminDevice['status']): 'success' | 'error' | 'warning' | 'neutral' {
    if (status === 'ONLINE') return 'success';
    if (status === 'OFFLINE') return 'error';
    if (status === 'BUSY') return 'warning';
    return 'neutral';
  }

  revoke(id: string) {
    this.adminDeviceService.revoke(id).subscribe(() => this.refresh());
  }

  togglePoolFallback(device: AdminDevice, enabled: boolean) {
    this.adminDeviceService.setPoolFallback(device.id, enabled).subscribe(() => this.refresh());
  }

  openPoolPairModal() {
    this.poolModalOpen.set(true);
    this.pairingCode.set(null);
    this.pairingError.set(null);
    this.alreadyActive.set(false);
    this.generatingCode.set(true);

    this.integrationService.activate('POOL', false).subscribe({
      next: (res) => {
        this.generatingCode.set(false);
        this.pairingCode.set(res.pairingCode);
      },
      error: (err: HttpErrorResponse) => {
        this.generatingCode.set(false);
        if (err?.error?.error === 'INTEGRATION_ALREADY_ACTIVATED') {
          this.alreadyActive.set(true);
        } else {
          this.pairingError.set(err?.error?.message ?? 'Impossible de générer le code de connexion.');
        }
      }
    });
  }

  regeneratePoolCode() {
    this.generatingCode.set(true);
    this.pairingError.set(null);
    this.integrationService.regeneratePairingCode('POOL').subscribe({
      next: (res) => {
        this.generatingCode.set(false);
        this.alreadyActive.set(false);
        this.pairingCode.set(res.pairingCode);
      },
      error: (err) => {
        this.generatingCode.set(false);
        this.pairingError.set(err?.error?.message ?? 'Impossible de régénérer le code.');
      }
    });
  }
}
