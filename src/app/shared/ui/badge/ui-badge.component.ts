import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type UiBadgeTone = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'accent';

/**
 * Badge / status chip (ex: "Populaire", "Delivered", "GET", "POST").
 */
@Component({
  selector: 'app-ui-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-badge.component.html',
  styleUrl: './ui-badge.component.scss'
})
export class UiBadgeComponent {
  @Input() tone: UiBadgeTone = 'neutral';
  @Input() pill = true;
}
