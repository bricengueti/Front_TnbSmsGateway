import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Carte de base : fond blanc, coin arrondi, ombre légère (Surface Level 1).
 * Toutes les cartes du site (feature, pricing, step...) s'appuient dessus.
 */
@Component({
  selector: 'app-ui-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-card.component.html',
  styleUrl: './ui-card.component.scss'
})
export class UiCardComponent {
  @Input() padding: 'sm' | 'md' | 'lg' = 'lg';
  @Input() elevated = false;
  @Input() highlight = false;
}
