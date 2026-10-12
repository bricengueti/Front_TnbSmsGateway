import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-progress-bar.component.html',
  styleUrl: './ui-progress-bar.component.scss'
})
export class UiProgressBarComponent {
  @Input() value = 0;      // 0-100
  @Input() tone: 'primary' | 'success' | 'warning' | 'error' = 'primary';
  @Input() height: 'sm' | 'md' = 'md';

  get clamped(): number {
    return Math.max(0, Math.min(100, this.value));
  }
}
