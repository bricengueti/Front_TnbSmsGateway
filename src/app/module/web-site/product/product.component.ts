import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiButtonComponent } from '../../../shared/ui/button/ui-button.component';
import { UiCodeBlockComponent, UiCodeSnippet } from '../../../shared/ui/code-block/ui-code-block.component';
import { UiStepCardComponent } from '../../../shared/ui/step-card/ui-step-card.component';
import { UiFeatureCardComponent } from '../../../shared/ui/feature-card/ui-feature-card.component';
import { RevealOnScrollDirective } from '../../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    UiButtonComponent,
    UiCodeBlockComponent,
    UiStepCardComponent,
    UiFeatureCardComponent,
    RevealOnScrollDirective
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {

  heroSnippet: UiCodeSnippet[] = [{
    label: 'cURL',
    code: `curl -X POST https://api.tnbsms.com/v1/messages/send \\
  -H "Authorization: Bearer sk_live_f893..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+237600000000",
    "from": "TNBSMS",
    "body": "Votre code de validation est 4920. Valide 5 min.",
    "callback_url": "https://votresite.com/webhook"
  }'`
  }];

  steps = [
    { step: 1, icon: 'key', tone: 'primary' as const, title: 'Clé API', description: `Créez votre compte sur notre dashboard unifié et générez vos clés d'API sécurisées pour l'environnement de test et de production.` },
    { step: 2, icon: 'dns', tone: 'accent' as const, title: 'Pack ou Device', description: `Achetez des crédits globaux via Mobile Money ou connectez vos propres téléphones Android pour agir comme passerelles d'envoi locales.` },
    { step: 3, icon: 'send', tone: 'teal' as const, title: 'Envoi', description: `Exécutez vos requêtes POST. Suivez les accusés de réception en temps réel grâce à nos webhooks hautement disponibles.` }
  ];

  smallFeatures = [
    { icon: 'webhook', tone: 'accent' as const, title: 'Webhooks', description: 'Mises à jour de statut DLR en temps réel directement sur vos serveurs.' },
    { icon: 'dashboard', tone: 'teal' as const, title: 'Dashboard Pro', description: 'Analysez vos campagnes, consultez les logs détaillés et gérez vos recharges.' }
  ];
}
