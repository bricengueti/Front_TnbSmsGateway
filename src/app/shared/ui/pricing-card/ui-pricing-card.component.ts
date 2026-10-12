import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../button/ui-button.component';

@Component({
  selector: 'app-ui-pricing-card',
  standalone: true,
  imports: [CommonModule, UiButtonComponent],
  templateUrl: './ui-pricing-card.component.html',
  styleUrl: './ui-pricing-card.component.scss'
})
export class UiPricingCardComponent {
  @Input() name = '';
  @Input() subtitle = '';
  @Input() price = '';
  @Input() period = '';
  @Input() strikePrice?: string;
  @Input() features: string[] = [];
  @Input() ctaLabel = 'Choisir ce pack';
  @Input() popular = false;
  @Input() emphasis: 'default' | 'primary' = 'default';
}
