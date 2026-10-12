import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-feature-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-feature-card.component.html',
  styleUrl: './ui-feature-card.component.scss'
})
export class UiFeatureCardComponent {
  @Input() icon = 'bolt';
  @Input() title = '';
  @Input() description = '';
  @Input() size: 'large' | 'small' = 'small';
  @Input() tone: 'primary' | 'accent' | 'teal' = 'primary';
}
