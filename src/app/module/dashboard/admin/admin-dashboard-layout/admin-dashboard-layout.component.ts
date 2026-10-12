import { Component } from '@angular/core';
import { DashboardShellComponent, DashboardNavItem } from '../../../../shared/ui/dashboard-shell/dashboard-shell.component';

const ADMIN_NAV: DashboardNavItem[] = [
  { path: '/dashboard/admin/overview', label: "Vue d'ensemble", icon: 'dashboard' },
  { path: '/dashboard/admin/users', label: 'Utilisateurs', icon: 'group' },
  { path: '/dashboard/admin/devices', label: 'Flotte de Devices', icon: 'router' },
  { path: '/dashboard/admin/plans', label: 'Gestion des Packs', icon: 'inventory_2' },
  { path: '/dashboard/admin/api-keys', label: 'Clés API Globales', icon: 'admin_panel_settings' }
];

@Component({
  selector: 'app-admin-dashboard-layout',
  standalone: true,
  imports: [DashboardShellComponent],
  template: `<app-dashboard-shell role="admin" [navItems]="navItems" />`
})
export class AdminDashboardLayoutComponent {
  navItems = ADMIN_NAV;
}
