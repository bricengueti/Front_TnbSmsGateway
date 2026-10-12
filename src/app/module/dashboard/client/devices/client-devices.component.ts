import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { UiButtonComponent } from '../../../../shared/ui/button/ui-button.component';
import { UiBadgeComponent } from '../../../../shared/ui/badge/ui-badge.component';
import { UiMetricCardComponent } from '../../../../shared/ui/metric-card/ui-metric-card.component';
import { UiModalComponent } from '../../../../shared/ui/modal/ui-modal.component';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { DeviceService } from '../../../../shared/services/device.service';
import { IntegrationService } from '../../../../shared/services/integration.service';
import { Device } from '../../../../shared/models/api.models';

@Component({
  selector: 'app-client-devices',
  standalone: true,
  imports: [CommonModule, UiButtonComponent, UiBadgeComponent, UiMetricCardComponent, UiModalComponent, RevealOnScrollDirective],
  templateUrl: './client-devices.component.html',
  styleUrl: './client-devices.component.scss'
})
export class ClientDevicesComponent implements OnInit {

  devices = signal<Device[]>([]);
  pairModalOpen = signal(false);
  generatingCode = signal(false);
  pairingCode = signal<string | null>(null);
  pairingError = signal<string | null>(null);
  /** true quand l'erreur backend est INTEGRATION_ALREADY_ACTIVATED — on
   * propose alors directement la régénération plutôt qu'un simple message. */
  alreadyActive = signal(false);

  constructor(
    private deviceService: DeviceService,
    private integrationService: IntegrationService
  ) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.deviceService.list().subscribe(d => this.devices.set(d));
  }

  get onlineCount() { return this.devices().filter(d => d.status === 'ONLINE').length; }
  get offlineCount() { return this.devices().filter(d => d.status === 'OFFLINE').length; }
  get disabledCount() { return this.devices().filter(d => d.status === 'DISABLED').length; }

  statusTone(status: Device['status']): 'success' | 'error' | 'warning' | 'neutral' {
    if (status === 'ONLINE') return 'success';
    if (status === 'OFFLINE') return 'error';
    if (status === 'BUSY') return 'warning';
    return 'neutral';
  }

  statusLabel(status: Device['status']): string {
    switch (status) {
      case 'ONLINE': return 'En Ligne';
      case 'OFFLINE': return 'Hors Ligne';
      case 'BUSY': return 'Occupé';
      default: return 'Désactivé';
    }
  }

  lastActivityLabel(d: Device): string {
    if (!d.lastHeartbeatAt) return 'Jamais connecté';
    return 'Dernier signal : ' + new Date(d.lastHeartbeatAt).toLocaleString('fr-FR');
  }

  /**
   * Génère un vrai code de connexion via POST /v1/integration/activate.
   * Le dashboard client ne propose QUE des devices PERSONAL — les devices
   * POOL (contribution au pool partagé) sont réservés à l'espace admin.
   */
  openPairModal() {
    this.pairModalOpen.set(true);
    this.pairingCode.set(null);
    this.pairingError.set(null);
    this.alreadyActive.set(false);
    this.generatingCode.set(true);

    this.integrationService.activate('PERSONAL', false).subscribe({
      next: (res) => {
        this.generatingCode.set(false);
        this.pairingCode.set(res.pairingCode);
      },
      error: (err: HttpErrorResponse) => {
        this.generatingCode.set(false);
        // Une intégration PERSONAL est déjà active pour ce compte : on
        // propose directement la régénération plutôt qu'un message sec.
        if (err?.error?.error === 'INTEGRATION_ALREADY_ACTIVATED') {
          this.alreadyActive.set(true);
        } else {
          this.pairingError.set(err?.error?.message ?? 'Impossible de générer le code de connexion.');
        }
      }
    });
  }

  regenerateCode() {
    this.generatingCode.set(true);
    this.pairingError.set(null);
    this.integrationService.regeneratePairingCode('PERSONAL').subscribe({
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
