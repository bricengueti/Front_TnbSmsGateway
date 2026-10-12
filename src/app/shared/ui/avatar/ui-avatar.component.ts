import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-avatar.component.html',
  styleUrl: './ui-avatar.component.scss'
})
export class UiAvatarComponent {
  @Input() name = '';
  @Input() imageUrl?: string;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get initials(): string {
    const parts = this.name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
  }

  /** Couleur déterministe basée sur le nom, pour distinguer les utilisateurs dans les listes. */
  get bgHue(): number {
    let hash = 0;
    for (let i = 0; i < this.name.length; i++) hash = this.name.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash) % 360;
  }
}
