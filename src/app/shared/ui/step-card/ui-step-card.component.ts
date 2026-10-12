import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-step-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-step-card.component.html',
  styleUrl: './ui-step-card.component.scss'
})
export class UiStepCardComponent {
  @Input() step = 1;
  @Input() icon = 'bolt';
  @Input() title = '';
  @Input() description = '';
  @Input() tone: 'primary' | 'accent' | 'teal' = 'primary';
}
