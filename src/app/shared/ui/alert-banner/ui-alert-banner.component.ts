import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../button/ui-button.component';

@Component({
  selector: 'app-ui-alert-banner',
  standalone: true,
  imports: [CommonModule, UiButtonComponent],
  templateUrl: './ui-alert-banner.component.html',
  styleUrl: './ui-alert-banner.component.scss'
})
export class UiAlertBannerComponent {
  @Input() tone: 'error' | 'warning' | 'info' = 'warning';
  @Input() icon = 'warning';
  @Input() title = '';
  @Input() description = '';
  @Input() actionLabel?: string;
  @Input() actionIcon?: string;
}
