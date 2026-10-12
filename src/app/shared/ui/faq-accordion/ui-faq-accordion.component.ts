import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface UiFaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-ui-faq-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-faq-accordion.component.html',
  styleUrl: './ui-faq-accordion.component.scss'
})
export class UiFaqAccordionComponent {
  @Input() items: UiFaqItem[] = [];

  openIndex = signal<number | null>(null);

  toggle(i: number) {
    this.openIndex.set(this.openIndex() === i ? null : i);
  }
}
