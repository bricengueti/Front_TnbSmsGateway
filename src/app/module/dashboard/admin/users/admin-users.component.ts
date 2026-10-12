import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiButtonComponent } from '../../../../shared/ui/button/ui-button.component';
import { UiBadgeComponent } from '../../../../shared/ui/badge/ui-badge.component';
import { UiMetricCardComponent } from '../../../../shared/ui/metric-card/ui-metric-card.component';
import { UiProgressBarComponent } from '../../../../shared/ui/progress-bar/ui-progress-bar.component';
import { UiAvatarComponent } from '../../../../shared/ui/avatar/ui-avatar.component';
import { UiTabsComponent, UiTabItem } from '../../../../shared/ui/tabs/ui-tabs.component';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { AdminUserService } from '../../../../shared/services/admin-user.service';
import { AdminUserDetail, AdminUserSummary } from '../../../../shared/models/api.models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, UiButtonComponent, UiBadgeComponent, UiMetricCardComponent, UiProgressBarComponent, UiAvatarComponent, UiTabsComponent, RevealOnScrollDirective],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent implements OnInit {

  users = signal<AdminUserSummary[]>([]);
  selectedUser = signal<AdminUserDetail | null>(null);
  activeTab = signal('overview');
  search = signal('');

  tabs: UiTabItem[] = [
    { id: 'overview', label: 'Vue Générale' },
    { id: 'keys', label: 'Clés API' },
    { id: 'devices', label: 'Appareils' }
  ];

  constructor(private adminUserService: AdminUserService) {}

  ngOnInit() {
    this.adminUserService.list().subscribe(users => {
      this.users.set(users);
      if (users.length) this.selectUser(users[0].id);
    });
  }

  get filteredUsers(): AdminUserSummary[] {
    const q = this.search().toLowerCase().trim();
    if (!q) return this.users();
    return this.users().filter(u => u.email.toLowerCase().includes(q) || (u.companyName ?? '').toLowerCase().includes(q));
  }

  get activeUserCount(): number { return this.users().filter(u => u.status === 'ACTIVE').length; }
  get suspendedUserCount(): number { return this.users().filter(u => u.status === 'SUSPENDED').length; }

  selectUser(id: string) {
    this.adminUserService.get(id).subscribe(u => {
      if (u) { this.selectedUser.set(u); this.activeTab.set('overview'); }
    });
  }

  toggleSuspend() {
    const u = this.selectedUser();
    if (!u) return;
    const newStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    this.adminUserService.updateStatus(u.id, newStatus).subscribe(() => {
      this.selectUser(u.id);
      this.adminUserService.list().subscribe(users => this.users.set(users));
    });
  }

  poolPercent(u: AdminUserDetail): number {
    const q = u.poolQuota;
    if (!q || q.unlimited || !q.smsQuota) return 0;
    return Math.min(100, Math.round(((q.smsSentInPeriod ?? 0) / q.smsQuota) * 100));
  }

  personalPercent(u: AdminUserDetail): number {
    const q = u.personalQuota;
    if (!q || q.unlimited || !q.quantityDevices) return 0;
    return Math.min(100, Math.round(((q.currentDeviceCount ?? 0) / q.quantityDevices) * 100));
  }
}
