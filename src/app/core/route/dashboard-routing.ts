import { Routes } from "@angular/router";
import { ClientDashboardLayoutComponent } from "../../module/dashboard/client/client-dashboard-layout/client-dashboard-layout.component";
import { AdminDashboardLayoutComponent } from "../../module/dashboard/admin/admin-dashboard-layout/admin-dashboard-layout.component";
import { adminGuard } from "../auth/admin.guard";

import { ClientOverviewComponent } from "../../module/dashboard/client/overview/client-overview.component";
import { ClientApiKeysComponent } from "../../module/dashboard/client/api-keys/client-api-keys.component";
import { ClientDevicesComponent } from "../../module/dashboard/client/devices/client-devices.component";
import { ClientMessagesComponent } from "../../module/dashboard/client/messages/client-messages.component";
import { ClientWebhooksComponent } from "../../module/dashboard/client/webhooks/client-webhooks.component";
import { ClientBillingComponent } from "../../module/dashboard/client/billing/client-billing.component";

import { AdminOverviewComponent } from "../../module/dashboard/admin/overview/admin-overview.component";
import { AdminUsersComponent } from "../../module/dashboard/admin/users/admin-users.component";
import { AdminDevicesComponent } from "../../module/dashboard/admin/devices/admin-devices.component";
import { AdminPlansComponent } from "../../module/dashboard/admin/plans/admin-plans.component";
import { AdminApiKeysComponent } from "../../module/dashboard/admin/api-keys/admin-api-keys.component";

export default [

  {
    path: '',
    redirectTo: 'client/overview',
    pathMatch: 'full'
  },

  // --- Espace client : développeurs intégrateurs ---
  {
    path: 'client',
    component: ClientDashboardLayoutComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: ClientOverviewComponent, data: { title: 'Vue d\'ensemble' } },
      { path: 'api-keys', component: ClientApiKeysComponent, data: { title: 'Clés API' } },
      { path: 'devices', component: ClientDevicesComponent, data: { title: 'Mes devices' } },
      { path: 'messages', component: ClientMessagesComponent, data: { title: 'Messages/Logs' } },
      { path: 'webhooks', component: ClientWebhooksComponent, data: { title: 'Webhooks' } },
      { path: 'billing', component: ClientBillingComponent, data: { title: 'Facturation' } }
    ]
  },

  // --- Espace admin : usage interne TNB ---
  // Protégé par adminGuard : redirige vers le dashboard client si le
  // compte connecté n'a pas isAdmin=true (champ ajouté à AuthResponse
  // par le backend — voir auth.models.ts).
  {
    path: 'admin',
    component: AdminDashboardLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: AdminOverviewComponent, data: { title: 'Aperçu Global' } },
      { path: 'users', component: AdminUsersComponent, data: { title: 'Gestion des Utilisateurs' } },
      { path: 'devices', component: AdminDevicesComponent, data: { title: 'Gestion des Appareils' } },
      { path: 'plans', component: AdminPlansComponent, data: { title: 'Gestion des Forfaits' } },
      { path: 'api-keys', component: AdminApiKeysComponent, data: { title: 'Clés API Globales' } }
    ]
  }

] as Routes;
