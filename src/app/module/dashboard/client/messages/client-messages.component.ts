import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiButtonComponent } from '../../../../shared/ui/button/ui-button.component';
import { UiBadgeComponent } from '../../../../shared/ui/badge/ui-badge.component';
import { UiMetricCardComponent } from '../../../../shared/ui/metric-card/ui-metric-card.component';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { MessageService } from '../../../../shared/services/message.service';
import { ReferenceService, RefCountry, RefOperator } from '../../../../shared/services/reference.service';
import { Message, MessageStats } from '../../../../shared/models/api.models';

@Component({
  selector: 'app-client-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, UiButtonComponent, UiBadgeComponent, UiMetricCardComponent, RevealOnScrollDirective],
  templateUrl: './client-messages.component.html',
  styleUrl: './client-messages.component.scss'
})
export class ClientMessagesComponent implements OnInit {

  stats = signal<MessageStats | null>(null);
  messages = signal<Message[]>([]);
  totalElements = signal(0);
  currentPage = signal(0);
  sending = signal(false);
  sent = signal(false);
  loading = signal(true);

  // Référentiel réel (GET /v1/reference/countries) — plus de valeurs codées en dur.
  countries = signal<RefCountry[]>([]);
  operators = signal<RefOperator[]>([]);

  // SendMessageRequest réel : to, body, countryCode, operator — pas de champ
  // "device" : le device est choisi automatiquement par le routeur backend
  // selon countryCode/operator (et le routingMode de la clé API utilisée).
  testForm = { to: '', body: '', countryCode: '', operator: '' };

  deliveryRate = computed(() => {
    const s = this.stats();
    if (!s || s.totalSent === 0) return 0;
    return Math.round((s.totalDelivered / s.totalSent) * 1000) / 10;
  });

  constructor(
    private messageService: MessageService,
    private referenceService: ReferenceService
  ) {}

  ngOnInit() {
    this.messageService.stats().subscribe(s => this.stats.set(s));
    this.loadPage(0);

    this.referenceService.countries().subscribe(countries => {
      this.countries.set(countries);
      if (countries.length) {
        this.testForm.countryCode = countries[0].code;
        this.onCountryChange();
      }
    });
  }

  onCountryChange() {
    if (!this.testForm.countryCode) { this.operators.set([]); return; }
    this.referenceService.operatorsByCountry(this.testForm.countryCode).subscribe(ops => {
      this.operators.set(ops);
      this.testForm.operator = ops[0]?.code ?? '';
    });
  }

  loadPage(page: number) {
    this.loading.set(true);
    this.messageService.list({ page }).subscribe(res => {
      this.messages.set(res.data);
      this.totalElements.set(res.totalElements);
      this.currentPage.set(page);
      this.loading.set(false);
    });
  }

  sendTest() {
    if (!this.testForm.to.trim() || !this.testForm.body.trim() || !this.testForm.countryCode || !this.testForm.operator) return;
    this.sending.set(true);
    this.messageService.send({ ...this.testForm }).subscribe({
      next: () => {
        this.sending.set(false);
        this.sent.set(true);
        this.testForm.to = '';
        this.testForm.body = '';
        this.loadPage(0);
        setTimeout(() => this.sent.set(false), 2500);
      },
      error: () => this.sending.set(false)
    });
  }

  statusTone(status: string): 'success' | 'warning' | 'error' | 'neutral' {
    switch (status) {
      case 'DELIVERED': return 'success';
      case 'SENT': case 'DISPATCHED': case 'PENDING': return 'warning';
      case 'FAILED': case 'EXPIRED': return 'error';
      default: return 'neutral';
    }
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalElements() / 4));
  }
}
