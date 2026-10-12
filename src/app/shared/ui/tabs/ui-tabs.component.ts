import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface UiTabItem { id: string; label: string; }

@Component({
  selector: 'app-ui-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-tabs.component.html',
  styleUrl: './ui-tabs.component.scss'
})
export class UiTabsComponent {
  @Input() tabs: UiTabItem[] = [];
  @Input() activeId = '';
  @Output() activeIdChange = new EventEmitter<string>();

  select(id: string) {
    this.activeId = id;
    this.activeIdChange.emit(id);
  }
}
