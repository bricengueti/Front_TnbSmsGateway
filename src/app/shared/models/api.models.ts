// =========================================================================
// Modèles TypeScript miroir EXACT des DTOs backend (TNB.SmsGateway.dto.*).
// Vérifiés champ par champ contre le code source Spring Boot le 08/08/2026.
// Source de vérité unique des formes de données pour tous les services
// dashboard. Quand un endpoint réel est branché, la forme ne doit pas
// changer : seul le *.service.ts correspondant passe de mock à HttpClient.
//
// Base URL de toutes les routes ci-dessous : https://<host>/api
// (server.servlet.context-path=/api — voir application.properties)
// =========================================================================

// --- Clés API (ApiKeyResponse — /v1/api-keys) -----------------------------
export type ApiKeyScope = 'FULL' | 'SEND_ONLY' | 'READ_ONLY';
export type RoutingMode = 'OWN_DEVICES' | 'MANAGED_POOL';

/**
 * Correspond exactement à ApiKeyResponse. Le champ `apiKey` (valeur en clair)
 * n'est jamais renseigné par GET /v1/api-keys (Jackson non_null omission) —
 * il n'apparaît que dans la réponse de POST /v1/api-keys, une seule fois.
 * Pas de champ `status`/`revoked`/`lastUsedAt` : une clé révoquée (DELETE)
 * disparaît simplement de la liste — il n'y a pas d'état "révoquée" affiché.
 */
export interface ApiKey {
  id: string;
  label: string;
  prefix: string;
  scope: ApiKeyScope;
  createdAt: string; // Instant ISO 8601
  apiKey?: string;    // uniquement présent juste après la création
}

// --- Devices & SIMs (DeviceResponse / DeviceSimResponse — /v1/devices) ---
export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'BUSY' | 'DISABLED';
export type DeviceType = 'PERSONAL' | 'POOL';

/** Correspond exactement à DeviceSimResponse. */
export interface DeviceSim {
  id: string;
  slotIndex: number;
  operatorCode: string;
  operatorName: string;
  phoneNumber: string;
  isActive: boolean;
  dailySmsSent: number;
  /** Nombre en chaîne, ou "ILLIMITE" — tel que renvoyé par le backend. */
  dailySmsQuota: string;
}

/**
 * Correspond exactement à DeviceResponse. Pas de champ `imei`, `pingMs`,
 * `volume24h` ni `batteryPercent` côté API — ces informations ne sont pas
 * exposées par le backend actuel.
 */
export interface Device {
  id: string;
  label: string;
  countryCode: string;
  countryName: string;
  status: DeviceStatus;
  pairedAt: string;
  lastHeartbeatAt: string | null;
  sims: DeviceSim[];
}

/** Correspond à DevicePairResponse (retour de POST /v1/devices/pair). */
export interface DevicePairResult {
  deviceId: string;
  secretToken: string;
  status: DeviceStatus;
  deviceType: DeviceType;
}

// --- Messages (MessageResponse / MessageStatsResponse — /v1/messages) ---
export type MessageDirection = 'INBOUND' | 'OUTBOUND';
export type MessageStatus = 'PENDING' | 'DISPATCHED' | 'SENT' | 'DELIVERED' | 'FAILED' | 'EXPIRED';

/** Correspond exactement à MessageResponse. Pas de "deviceLabel" — seul
 * `deviceId` est renvoyé ; `routingMode` indique OWN_DEVICES/MANAGED_POOL. */
export interface Message {
  messageId: string;
  direction: MessageDirection;
  toNumber: string;
  fromNumber: string | null;
  body: string;
  countryCode: string;
  operatorCode: string;
  status: MessageStatus;
  routingMode: RoutingMode;
  attempts: number;
  errorReason: string | null;
  deviceId: string | null;
  createdAt: string;
  dispatchedAt: string | null;
  deliveredAt: string | null;
}

/** Correspond exactement à MessageStatsResponse. Pas de "deliveryRate" —
 * à calculer côté front : totalDelivered / totalSent * 100. */
export interface MessageStats {
  totalSent: number;
  totalReceived: number;
  totalFailed: number;
  totalDelivered: number;
  sentToday: number;
  receivedToday: number;
}

// --- Webhooks (/v1/webhook) -----------------------------------------------
/**
 * GET /v1/webhook renvoie un Map<String,Object> brut avec exactement ces
 * 3 clés — pas de système d'événements multiples (sms.sent, device.offline...)
 * côté backend actuel : un seul webhook reçoit les SMS entrants.
 */
export interface WebhookConfig {
  webhookUrl: string | null;
  webhookSecret: string | null; // masqué ("••••••••") ou null si aucun secret
  hasWebhook: boolean;
}

// --- Facturation (PurchaseController — /v1/purchases) ---------------------
/**
 * Correspond à PaymentInitiationResult, seule réponse que le backend
 * renvoie aujourd'hui côté achat. ATTENTION : il n'existe actuellement
 * aucun endpoint GET pour lister les packs disponibles côté client, ni
 * pour consulter l'abonnement en cours ou l'historique des transactions
 * (ces vues n'existent que côté admin : GET /admin/plans, GET /admin/users/{id}).
 * À ajouter côté backend pour rendre l'écran Facturation pleinement
 * dynamique : GET /v1/plans (public) et GET /v1/me/quota.
 */
export interface PaymentInitiation {
  providerReference: string;
  paymentUrl: string;
}

// --- Coverage / Reference (/v1/coverage, /v1/reference) -------------------
export interface CoverageOperator {
  operatorCode: string;
  operatorName: string;
  availableDevices: number;
  activeSims: number;
  dailyCapacity: number;
}

export interface CoverageCountry {
  countryCode: string;
  countryName: string;
  operators: CoverageOperator[];
}

// =========================================================================
// ADMINISTRATION — toutes les routes ci-dessous sont sous /admin (PAS /v1/admin)
// =========================================================================

export type UserStatus = 'ACTIVE' | 'SUSPENDED';
export type PlanType = 'POOL' | 'PERSONAL';
export type PurchaseStatus = 'PENDING' | 'PAID' | 'FAILED';

/** Correspond exactement à AdminUserResponse (GET /admin/users). */
export interface AdminUserSummary {
  id: string;
  email: string;
  companyName: string | null;
  status: UserStatus;
  isAdmin: boolean;
  deviceCount: number;
  apiKeyCount: number;
  createdAt: string;
}

/** Correspond exactement à AdminApiKeyResponse. */
export interface AdminApiKey {
  id: string;
  ownerEmail: string;
  label: string;
  keyPrefix: string;
  scope: ApiKeyScope;
  routingMode: RoutingMode;
  revoked: boolean;
  createdAt: string;
}

/** Correspond exactement à AdminDeviceResponse. Pas d'IMEI/ping/volume. */
export interface AdminDevice {
  id: string;
  ownerEmail: string;
  type: DeviceType;
  status: DeviceStatus;
  countryCode: string;
  label: string;
  revoked: boolean;
  availableForPool: boolean;
  pairedAt: string;
  lastHeartbeatAt: string | null;
}

/**
 * Correspond exactement à UserQuotaResponse (backend patché 11/08/2026) :
 * modèle à durée de validité, plus de reset mensuel automatique.
 * POOL a smsQuota/smsSentInPeriod ; PERSONAL a quantityDevices/currentDeviceCount.
 * periodEndsAt/expired sont communs aux deux types.
 */
export interface UserQuota {
  userId: string;
  userEmail: string;
  type: PlanType;
  planName: string | null;
  unlimited: boolean;
  smsSentInPeriod: number | null;   // POOL uniquement
  smsQuota: number | null;          // POOL uniquement — total pour toute la période
  quantityDevices: number | null;   // PERSONAL uniquement
  currentDeviceCount: number | null; // PERSONAL uniquement
  periodEndsAt: string | null;      // date de fin de validité du pack
  expired: boolean;                 // true si periodEndsAt est dépassée
}

/** Correspond exactement à AdminUserDetailResponse. */
export interface AdminUserDetail {
  id: string;
  email: string;
  companyName: string | null;
  status: UserStatus;
  isAdmin: boolean;
  createdAt: string;
  devices: AdminDevice[];
  apiKeys: AdminApiKey[];
  poolQuota: UserQuota | null;
  personalQuota: UserQuota | null;
}

/**
 * Correspond exactement à PlanResponse (backend patché 11/08/2026) :
 * validityMonths remplace la notion de "mensuel", quantitySms/quantityDevices
 * remplacent monthlySmsLimit/maxDevices.
 */
export interface AdminPlan {
  id: string;
  name: string;
  description: string | null;
  type: PlanType;
  validityMonths: number;           // durée de validité du pack, en mois
  quantitySms: number | null;       // POOL uniquement — quota total pour toute la période
  quantityDevices: number | null;   // PERSONAL uniquement
  price: number;
  active: boolean;
}

/** Correspond exactement à AdminStatsResponse (GET /admin/stats). Pas de
 * revenu/MRR, pas de taux de livraison global : uniquement des compteurs. */
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  adminUsers: number;
  totalDevices: number;
  personalDevices: number;
  poolDevices: number;
  onlineDevices: number;
  revokedDevices: number;
  totalApiKeys: number;
  ownDevicesKeys: number;
  managedPoolKeys: number;
  revokedApiKeys: number;
  totalMessagesSent: number;
  totalPlans: number;
}
