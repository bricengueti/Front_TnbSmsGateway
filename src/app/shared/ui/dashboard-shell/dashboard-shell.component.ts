import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UiAvatarComponent } from '../avatar/ui-avatar.component';
import { AuthService } from '../../../core/auth/auth.service';
import { NotificationService } from '../../../core/notifications/notification.service';

export interface DashboardNavItem {
  path: string;
  label: string;
  icon: string;
}

/**
 * Coquille commune aux deux dashboards (client et admin) : sidebar + topbar.
 * Les pages elles-mêmes vivent dans le <router-outlet> imbriqué.
 *
 * Paramétrée par @Input plutôt que dupliquée, pour que toute évolution du
 * shell (topbar, sidebar, notifications...) profite aux deux espaces d'un
 * coup — c'est la pièce centrale de la maintenabilité de ce module.
 */
@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, UiAvatarComponent],
  templateUrl: './dashboard-shell.component.html',
  styleUrl: './dashboard-shell.component.scss'
})
export class DashboardShellComponent {
  @Input() role: 'client' | 'admin' = 'client';
  @Input() navItems: DashboardNavItem[] = [];

  constructor(
    public authService: AuthService,
    private notifications: NotificationService,
    private router: Router
  ) {}

  get userName(): string {
    return this.authService.currentUser()?.email ?? 'Compte';
  }

  /** Le lien de bascule d'espace n'apparaît que pour les comptes admin —
   * un client normal ne voit jamais l'entrée vers /dashboard/admin. */
  get canSwitchToAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get switchTarget(): string {
    return this.role === 'client' ? '/dashboard/admin/overview' : '/dashboard/client/overview';
  }

  get switchLabel(): string {
    return this.role === 'client' ? 'Espace Admin' : 'Espace Client';
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.notifications.info('Vous avez été déconnecté.');
      this.router.navigate(['/login']);
    });
  }
}
