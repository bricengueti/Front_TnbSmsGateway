import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiButtonComponent } from '../../../../shared/ui/button/ui-button.component';
import { UiBadgeComponent } from '../../../../shared/ui/badge/ui-badge.component';
import { UiMetricCardComponent } from '../../../../shared/ui/metric-card/ui-metric-card.component';
import { UiModalComponent } from '../../../../shared/ui/modal/ui-modal.component';
import { UiToggleSwitchComponent } from '../../../../shared/ui/toggle-switch/ui-toggle-switch.component';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { AdminPlanService } from '../../../../shared/services/admin-plan.service';
import { AdminPlan, PlanType } from '../../../../shared/models/api.models';

@Component({
  selector: 'app-admin-plans',
  standalone: true,
  imports: [CommonModule, FormsModule, UiButtonComponent, UiBadgeComponent, UiMetricCardComponent, UiModalComponent, UiToggleSwitchComponent, RevealOnScrollDirective],
  templateUrl: './admin-plans.component.html',
  styleUrl: './admin-plans.component.scss'
})
export class AdminPlansComponent implements OnInit {

  plans = signal<AdminPlan[]>([]);
  activeFilter = signal<'ALL' | PlanType>('ALL');
  createModalOpen = signal(false);

  form: { name: string; description: string; type: PlanType; validityMonths: number; price: number; quantitySms: number | null; quantityDevices: number | null } = {
    name: '', description: '', type: 'POOL', validityMonths: 1, price: 0, quantitySms: null, quantityDevices: null
  };

  constructor(private adminPlanService: AdminPlanService) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.adminPlanService.list().subscribe(all => {
      const filter = this.activeFilter();
      this.plans.set(filter === 'ALL' ? all : all.filter(p => p.type === filter));
    });
  }

  setFilter(f: 'ALL' | PlanType) {
    this.activeFilter.set(f);
    this.refresh();
  }

  get activeCount() { return this.plans().filter(p => p.active).length; }

  /** Vrai toggle bidirectionnel — voir note dans admin-plan.service.ts. */
  toggleActive(id: string) {
    this.adminPlanService.toggleActive(id).subscribe(() => this.refresh());
  }

  openCreate() {
    this.form = { name: '', description: '', type: 'POOL', validityMonths: 1, price: 0, quantitySms: null, quantityDevices: null };
    this.createModalOpen.set(true);
  }

  submitCreate() {
    if (!this.form.name.trim()) return;
    const payload = {
      name: this.form.name,
      description: this.form.description,
      type: this.form.type,
      validityMonths: this.form.validityMonths,
      price: this.form.price,
      quantitySms: this.form.type === 'POOL' ? this.form.quantitySms : null,
      quantityDevices: this.form.type === 'PERSONAL' ? this.form.quantityDevices : null
    };
    this.adminPlanService.create(payload).subscribe(() => {
      this.createModalOpen.set(false);
      this.refresh();
    });
  }
}
