import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UiButtonComponent } from '../button/ui-button.component';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, UiButtonComponent],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss'
})
export class SiteHeaderComponent {
  menuOpen = false;
  authService = inject(AuthService);

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
