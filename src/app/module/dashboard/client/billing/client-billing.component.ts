import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../../../../shared/ui/button/ui-button.component';
import { UiBadgeComponent } from '../../../../shared/ui/badge/ui-badge.component';
import { UiProgressBarComponent } from '../../../../shared/ui/progress-bar/ui-progress-bar.component';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { BillingService, MyQuota } from '../../../../shared/services/billing.service';
import { AdminPlan, UserQuota } from '../../../../shared/models/api.models';

@Component({
  selector: 'app-client-billing',
  standalone: true,
  imports: [CommonModule, UiButtonComponent, UiBadgeComponent, UiProgressBarComponent, RevealOnScrollDirective],
  templateUrl: './client-billing.component.html',
  styleUrl: './client-billing.component.scss'
})
export class ClientBillingComponent implements OnInit {

  plans = signal<AdminPlan[]>([]);
  quota = signal<MyQuota | null>(null);
  loadingPlans = signal(true);
  loadingQuota = signal(true);
  purchasingId = signal<string | null>(null);
  paymentUrl = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  constructor(private billingService: BillingService) {}

  ngOnInit() {
    this.billingService.listPlans().subscribe({
      next: (plans) => {
        // Les packs inactifs sont affichés mais non achetables — on les
        // pousse en fin de liste plutôt que de les cacher, pour rester
        // transparent sur le catalogue complet enregistré par l'admin.
        this.plans.set([...plans].sort((a, b) => Number(b.active) - Number(a.active)));
        this.loadingPlans.set(false);
      },
      error: () => this.loadingPlans.set(false)
    });

    this.billingService.myQuota().subscribe({
      next: (q) => { this.quota.set(q); this.loadingQuota.set(false); },
      error: () => this.loadingQuota.set(false)
    });
  }

  purchase(plan: AdminPlan) {
    if (!plan.active) return;
    this.purchasingId.set(plan.id);
    this.paymentUrl.set(null);
    this.errorMessage.set(null);
    this.billingService.purchasePlan(plan.id).subscribe({
      next: (res) => {
        this.purchasingId.set(null);
        this.paymentUrl.set(res.paymentUrl);
      },
      error: (err) => {
        this.purchasingId.set(null);
        this.errorMessage.set(err?.error?.message ?? "Impossible d'initier le paiement.");
      }
    });
  }

  limitLabel(plan: AdminPlan): string {
    return plan.type === 'POOL'
      ? `${(plan.quantitySms ?? 0).toLocaleString('fr-FR')} SMS / ${plan.validityMonths} mois`
      : `${plan.quantityDevices ?? 0} devices max`;
  }

  poolPercent(q: UserQuota): number {
    if (q.unlimited || !q.smsQuota) return 0;
    return Math.min(100, Math.round(((q.smsSentInPeriod ?? 0) / q.smsQuota) * 100));
  }

  personalPercent(q: UserQuota): number {
    if (q.unlimited || !q.quantityDevices) return 0;
    return Math.min(100, Math.round(((q.currentDeviceCount ?? 0) / q.quantityDevices) * 100));
  }
}
