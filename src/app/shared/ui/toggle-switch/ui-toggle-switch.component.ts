import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-toggle-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-toggle-switch.component.html',
  styleUrl: './ui-toggle-switch.component.scss'
})
export class UiToggleSwitchComponent {
  @Input() checked = false;
  @Input() ariaLabel = 'Activer';
  @Output() checkedChange = new EventEmitter<boolean>();

  toggle() {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}
