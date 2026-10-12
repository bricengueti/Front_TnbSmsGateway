import { Component } from '@angular/core';
import { DashboardShellComponent, DashboardNavItem } from '../../../../shared/ui/dashboard-shell/dashboard-shell.component';

const CLIENT_NAV: DashboardNavItem[] = [
  { path: '/dashboard/client/overview', label: "Vue d'ensemble", icon: 'dashboard' },
  { path: '/dashboard/client/api-keys', label: 'Clés API', icon: 'key' },
  { path: '/dashboard/client/devices', label: 'Mes devices', icon: 'smartphone' },
  { path: '/dashboard/client/messages', label: 'Messages/Logs', icon: 'history' },
  { path: '/dashboard/client/webhooks', label: 'Webhooks', icon: 'webhook' },
  { path: '/dashboard/client/billing', label: 'Facturation', icon: 'receipt_long' }
];

@Component({
  selector: 'app-client-dashboard-layout',
  standalone: true,
  imports: [DashboardShellComponent],
  template: `<app-dashboard-shell role="client" [navItems]="navItems" />`
})
export class ClientDashboardLayoutComponent {
  navItems = CLIENT_NAV;
}
