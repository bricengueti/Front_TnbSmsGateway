import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type UiButtonVariant = 'primary' | 'secondary' | 'ghost' | 'inverse';
export type UiButtonSize = 'sm' | 'md' | 'lg';

/**
 * Bouton de marque unique pour tout le site vitrine + dashboards.
 * Toute évolution visuelle des boutons se fait ICI, jamais dans les pages.
 *
 * Usage :
 * <app-ui-button variant="primary" size="md" icon="arrow_forward">Commencer</app-ui-button>
 */
@Component({
  selector: 'app-ui-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-button.component.html',
  styleUrl: './ui-button.component.scss'
})
export class UiButtonComponent {
  @Input() variant: UiButtonVariant = 'primary';
  @Input() size: UiButtonSize = 'md';
  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'right';
  @Input() fullWidth = false;
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' = 'button';
}
