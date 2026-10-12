import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-metric-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-metric-card.component.html',
  styleUrl: './ui-metric-card.component.scss'
})
export class UiMetricCardComponent {
  @Input() label = '';
  @Input() value: string | number | null | undefined = '';
  @Input() unit = '';
  @Input() icon?: string;
  @Input() trend?: number;           // ex: 12.4 → "+12.4%"
  @Input() trendLabel?: string;      // remplace l'affichage % si fourni (ex: "Stable")
  @Input() tone: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default';
  @Input() emphasis = false;         // fond plein coloré (carte mise en avant)
}
