import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiButtonComponent } from '../../../../shared/ui/button/ui-button.component';
import { UiBadgeComponent } from '../../../../shared/ui/badge/ui-badge.component';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { WebhookService } from '../../../../shared/services/webhook.service';
import { WebhookConfig } from '../../../../shared/models/api.models';

@Component({
  selector: 'app-client-webhooks',
  standalone: true,
  imports: [CommonModule, FormsModule, UiButtonComponent, UiBadgeComponent, RevealOnScrollDirective],
  templateUrl: './client-webhooks.component.html',
  styleUrl: './client-webhooks.component.scss'
})
export class ClientWebhooksComponent implements OnInit {

  config = signal<WebhookConfig | null>(null);
  webhookUrl = '';
  saving = signal(false);
  saved = signal(false);
  testing = signal(false);
  testResult = signal<{ success: boolean; message: string } | null>(null);
  rotating = signal(false);
  revealedSecret = signal<string | null>(null);

  constructor(private webhookService: WebhookService) {}

  ngOnInit() {
    this.webhookService.getConfig().subscribe(c => {
      this.config.set(c);
      this.webhookUrl = c.webhookUrl ?? '';
    });
  }

  save() {
    if (!this.webhookUrl.trim()) return;
    this.saving.set(true);
    this.webhookService.save(this.webhookUrl).subscribe(() => {
      this.saving.set(false);
      this.saved.set(true);
      this.config.update(c => c ? { ...c, webhookUrl: this.webhookUrl, hasWebhook: true } : c);
      setTimeout(() => this.saved.set(false), 2000);
    });
  }

  sendPing() {
    this.testing.set(true);
    this.testResult.set(null);
    this.webhookService.sendTestPing().subscribe(res => {
      this.testing.set(false);
      this.testResult.set(res);
    });
  }

  rotateSecret() {
    this.rotating.set(true);
    this.webhookService.rotateSecret().subscribe(res => {
      this.rotating.set(false);
      this.revealedSecret.set(res.newSecret);
      this.config.update(c => c ? { ...c, webhookSecret: '••••••••' } : c);
    });
  }
}
