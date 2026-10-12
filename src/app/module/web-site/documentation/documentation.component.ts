import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiCodeBlockComponent, UiCodeSnippet } from '../../../shared/ui/code-block/ui-code-block.component';
import { UiBadgeComponent } from '../../../shared/ui/badge/ui-badge.component';

interface ParamRow {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface ParamTable {
  heading: string;
  rows: ParamRow[];
}

interface ErrorCodeRow {
  code: string;
  status: string;
  description: string;
}

interface DocSection {
  id: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  path?: string;
  title: string;
  auth?: string;
  intro: string;
  notes?: string[];
  paramTables?: ParamTable[];
  showErrorTable?: boolean;
  snippets: UiCodeSnippet[];
}

interface DocNavLink {
  id: string;
  label: string;
  method?: DocSection['method'];
}

interface DocNavSection {
  heading: string;
  links: DocNavLink[];
}

const BASE_URL = 'https://api.tnbsmsgateway.com/api/v1';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule, FormsModule, UiCodeBlockComponent, UiBadgeComponent],
  templateUrl: './documentation.component.html',
  styleUrl: './documentation.component.scss'
})
export class DocumentationComponent {

  search = signal('');
  activeId = signal('introduction');
  copiedUrl = signal(false);
  baseUrl = BASE_URL;

  navSections: DocNavSection[] = [
    {
      heading: 'Démarrage',
      links: [
        { id: 'introduction', label: 'Introduction' },
        { id: 'auth', label: 'Authentification', method: 'POST' },
        { id: 'api-keys', label: 'Clés API', method: 'POST' },
        { id: 'errors', label: 'Gestion des erreurs' }
      ]
    },
    {
      heading: 'Messages',
      links: [
        { id: 'send-message', label: 'Envoyer un SMS', method: 'POST' },
        { id: 'send-bulk', label: 'Envoi en masse', method: 'POST' },
        { id: 'list-messages', label: 'Lister les messages', method: 'GET' },
        { id: 'message-stats', label: 'Statistiques', method: 'GET' }
      ]
    },
    {
      heading: 'Devices & SIMs (BYOD)',
      links: [
        { id: 'devices-pair', label: 'Pairer un device', method: 'POST' },
        { id: 'devices-manage', label: 'Gérer les devices', method: 'GET' },
        { id: 'devices-sims', label: 'Gérer les SIMs', method: 'PATCH' }
      ]
    },
    {
      heading: 'Webhooks',
      links: [
        { id: 'webhooks', label: 'Configurer un webhook', method: 'PUT' }
      ]
    },
    {
      heading: 'Référence',
      links: [
        { id: 'coverage', label: 'Couverture réseau', method: 'GET' },
        { id: 'reference', label: 'Pays & opérateurs', method: 'GET' }
      ]
    }
  ];

  private sections: DocSection[] = [

    // ---------------------------------------------------------------
    {
      id: 'introduction',
      title: 'Introduction',
      intro: `L'API TNB SmsGateway vous permet d'envoyer et de recevoir des SMS via un pool de devices mutualisés (MANAGED_POOL) ou vos propres devices Android connectés (OWN_DEVICES). Toutes les requêtes se font en HTTPS et les corps de requête/réponse sont en JSON.`,
      notes: [
        `L'authentification se fait soit par clé API (header Authorization: Bearer, pour vos intégrations serveur-à-serveur), soit par token JWT (pour les appels depuis votre propre dashboard). Chaque clé API porte un scope — FULL, SEND_ONLY ou READ_ONLY — et un mode de routage — OWN_DEVICES ou MANAGED_POOL — définis à la création.`,
        `Toutes les routes exposées à l'intégrateur sont préfixées par ${BASE_URL}.`
      ],
      snippets: [{
        label: 'cURL',
        code: `curl -X GET ${BASE_URL}/coverage \\
  -H "Authorization: Bearer VOTRE_CLE_API"`
      }]
    },

    // ---------------------------------------------------------------
    {
      id: 'auth',
      method: 'POST',
      path: '/auth/otp/verify',
      title: 'Authentification (OTP)',
      auth: 'Aucune (endpoint public)',
      intro: `L'authentification dashboard se fait en deux temps par code à usage unique envoyé par email, sans mot de passe.`,
      notes: [
        `1. POST /auth/otp/request avec votre email déclenche l'envoi d'un code à 6 chiffres.`,
        `2. POST /auth/otp/verify avec l'email et le code retourne un accessToken (JWT, valide 12h) et un refreshToken (valide 7 jours). Le champ isNewAccount indique si un compte vient d'être créé automatiquement.`,
        `3. POST /auth/refresh permet d'obtenir un nouvel accessToken à partir du refreshToken sans repasser par l'OTP.`,
        `4. POST /auth/logout invalide la session courante.`
      ],
      paramTables: [
        {
          heading: 'Corps de la requête — otp/verify',
          rows: [
            { name: 'email', type: 'String', required: true, description: "Email de l'utilisateur, identique à celui utilisé pour la demande d'OTP." },
            { name: 'code', type: 'String', required: true, description: 'Code à 6 chiffres reçu par email.' }
          ]
        }
      ],
      snippets: [
        {
          label: 'cURL',
          code: `# 1. Demander un code OTP
curl -X POST ${BASE_URL}/auth/otp/request \\
  -H "Content-Type: application/json" \\
  -d '{ "email": "vous@entreprise.com" }'

# 2. Vérifier le code et obtenir les tokens
curl -X POST ${BASE_URL}/auth/otp/verify \\
  -H "Content-Type: application/json" \\
  -d '{ "email": "vous@entreprise.com", "code": "123456" }'`
        },
        {
          label: 'Node.js',
          code: `const axios = require('axios');

await axios.post('${BASE_URL}/auth/otp/request', {
  email: 'vous@entreprise.com'
});

const { data } = await axios.post('${BASE_URL}/auth/otp/verify', {
  email: 'vous@entreprise.com',
  code: '123456'
});

console.log(data.accessToken, data.refreshToken);`
        },
        {
          label: 'Python',
          code: `import requests

requests.post(f"${BASE_URL}/auth/otp/request", json={
    "email": "vous@entreprise.com"
})

res = requests.post(f"${BASE_URL}/auth/otp/verify", json={
    "email": "vous@entreprise.com",
    "code": "123456"
})

tokens = res.json()
print(tokens["accessToken"], tokens["refreshToken"])`
        },
        {
          label: 'Java',
          code: `HttpClient client = HttpClient.newHttpClient();

HttpRequest verify = HttpRequest.newBuilder()
  .uri(URI.create("${BASE_URL}/auth/otp/verify"))
  .header("Content-Type", "application/json")
  .POST(HttpRequest.BodyPublishers.ofString(
    "{\\"email\\":\\"vous@entreprise.com\\",\\"code\\":\\"123456\\"}"
  ))
  .build();

client.send(verify, HttpResponse.BodyHandlers.ofString());`
        }
      ]
    },

    // ---------------------------------------------------------------
    {
      id: 'api-keys',
      method: 'POST',
      path: '/api-keys',
      title: 'Clés API',
      auth: 'Bearer (JWT dashboard)',
      intro: `Les clés API servent à authentifier vos appels serveur-à-serveur (envoi de SMS notamment). La clé complète n'est affichée qu'une seule fois à la création — conservez-la immédiatement.`,
      notes: [
        `GET /api-keys liste vos clés (préfixe masqué uniquement). DELETE /api-keys/{id} révoque une clé immédiatement et de façon irréversible.`
      ],
      paramTables: [
        {
          heading: 'Corps de la requête',
          rows: [
            { name: 'label', type: 'String', required: true, description: 'Nom descriptif de la clé (ex: "Production Mobile App").' },
            { name: 'scope', type: 'String', required: true, description: 'FULL, SEND_ONLY ou READ_ONLY.' },
            { name: 'routingMode', type: 'String', required: false, description: "OWN_DEVICES (défaut) ou MANAGED_POOL. MANAGED_POOL nécessite qu'un admin vous assigne un pack, sinon la clé est bloquée." }
          ]
        }
      ],
      snippets: [{
        label: 'cURL',
        code: `curl -X POST ${BASE_URL}/api-keys \\
  -H "Authorization: Bearer VOTRE_JWT" \\
  -H "Content-Type: application/json" \\
  -d '{
    "label": "Production Mobile App",
    "scope": "SEND_ONLY",
    "routingMode": "OWN_DEVICES"
  }'

# Réponse 201 — la clé "apiKey" ne sera plus jamais renvoyée en clair
# { "id": "...", "apiKey": "tnb_live_7f2k9xq1m3p5v8d2c4a6", "prefix": "tnb_live_7f2k9x...", "scope": "SEND_ONLY", ... }`
      }]
    },

    // ---------------------------------------------------------------
    {
      id: 'errors',
      title: 'Gestion des erreurs',
      intro: `Toutes les erreurs suivent le même format JSON standardisé, avec un code d'erreur stable à utiliser dans votre logique applicative (ne parsez jamais le champ "message", destiné à l'affichage humain).`,
      paramTables: [
        {
          heading: 'Structure ErrorResponse',
          rows: [
            { name: 'timestamp', type: 'String (ISO 8601)', required: true, description: "Horodatage de l'erreur." },
            { name: 'status', type: 'Integer', required: true, description: 'Code HTTP (ex: 422).' },
            { name: 'error', type: 'String', required: true, description: 'Code stable identifiant le type d\'erreur (ex: NO_DEVICE_FOR_COUNTRY_OPERATOR).' },
            { name: 'message', type: 'String', required: true, description: 'Description lisible, à afficher éventuellement mais pas à parser.' },
            { name: 'path', type: 'String', required: true, description: 'Route appelée.' },
            { name: 'validationErrors', type: 'Object', required: false, description: 'Détail champ par champ en cas de 400 de validation.' }
          ]
        }
      ],
      showErrorTable: true,
      snippets: [{
        label: 'Exemple 422',
        code: `{
  "timestamp": "2026-08-07T10:12:03Z",
  "status": 422,
  "error": "NO_DEVICE_FOR_COUNTRY_OPERATOR",
  "message": "Aucun device disponible pour le couple CM/MTN_CM",
  "path": "/api/v1/messages/send",
  "validationErrors": null
}`
      }]
    },

    // ---------------------------------------------------------------
    {
      id: 'send-message',
      method: 'POST',
      path: '/messages/send',
      title: 'Envoyer un SMS',
      auth: 'Bearer (clé API — scope FULL ou SEND_ONLY)',
      intro: `Envoie un SMS unique via un device disponible pour le couple pays/opérateur demandé. La requête est acceptée immédiatement (202) — le statut final (DELIVERED, FAILED...) est à récupérer via GET /messages/{id} ou reçu sur votre webhook.`,
      paramTables: [
        {
          heading: 'Corps de la requête',
          rows: [
            { name: 'to', type: 'String', required: true, description: 'Numéro du destinataire au format E.164 (ex: +237699999999).' },
            { name: 'body', type: 'String', required: true, description: 'Contenu du message. 160 caractères maximum pour un SMS standard.' },
            { name: 'countryCode', type: 'String', required: true, description: 'Code pays ISO 3166-1 alpha-2 (ex: CM).' },
            { name: 'operator', type: 'String', required: true, description: 'Code opérateur (ex: MTN_CM).' },
            { name: 'priority', type: 'String', required: false, description: 'NORMAL ou HIGH.' },
            { name: 'idempotencyKey', type: 'String', required: false, description: "Clé unique pour éviter les envois en double en cas de retry côté client." }
          ]
        }
      ],
      snippets: [
        {
          label: 'cURL',
          code: `curl -X POST ${BASE_URL}/messages/send \\
  -H "Authorization: Bearer VOTRE_CLE_API" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+237699999999",
    "body": "Votre code de validation est 4589.",
    "countryCode": "CM",
    "operator": "MTN_CM",
    "priority": "NORMAL",
    "idempotencyKey": "order-12345-1689012345"
  }'`
        },
        {
          label: 'Node.js',
          code: `const axios = require('axios');

const { data } = await axios.post('${BASE_URL}/messages/send', {
  to: '+237699999999',
  body: 'Votre code de validation est 4589.',
  countryCode: 'CM',
  operator: 'MTN_CM',
  priority: 'NORMAL'
}, {
  headers: {
    Authorization: 'Bearer VOTRE_CLE_API',
    'Content-Type': 'application/json'
  }
});

console.log(data.messageId, data.status);`
        },
        {
          label: 'Python',
          code: `import requests

response = requests.post(
    "${BASE_URL}/messages/send",
    headers={"Authorization": "Bearer VOTRE_CLE_API"},
    json={
        "to": "+237699999999",
        "body": "Votre code de validation est 4589.",
        "countryCode": "CM",
        "operator": "MTN_CM",
        "priority": "NORMAL"
    }
)

print(response.json()["messageId"], response.json()["status"])`
        },
        {
          label: 'Java',
          code: `String body = """
  {
    "to": "+237699999999",
    "body": "Votre code de validation est 4589.",
    "countryCode": "CM",
    "operator": "MTN_CM",
    "priority": "NORMAL"
  }
  """;

HttpRequest request = HttpRequest.newBuilder()
  .uri(URI.create("${BASE_URL}/messages/send"))
  .header("Authorization", "Bearer VOTRE_CLE_API")
  .header("Content-Type", "application/json")
  .POST(HttpRequest.BodyPublishers.ofString(body))
  .build();

HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());`
        }
      ]
    },

    // ---------------------------------------------------------------
    {
      id: 'send-bulk',
      method: 'POST',
      path: '/messages/send-bulk',
      title: 'Envoi en masse',
      auth: 'Bearer (clé API)',
      intro: `Envoie jusqu'à 100 messages en une seule requête. Chaque message est traité indépendamment ; un échec sur l'un n'annule pas les autres.`,
      paramTables: [
        {
          heading: 'Corps de la requête',
          rows: [
            { name: 'messages', type: 'Array (max 100)', required: true, description: 'Liste d\'objets { to, body, countryCode, operator }, mêmes règles que pour un envoi unique.' }
          ]
        }
      ],
      snippets: [{
        label: 'cURL',
        code: `curl -X POST ${BASE_URL}/messages/send-bulk \\
  -H "Authorization: Bearer VOTRE_CLE_API" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [
      { "to": "+237699999999", "body": "Bonjour Awa", "countryCode": "CM", "operator": "MTN_CM" },
      { "to": "+237655555555", "body": "Bonjour Paul", "countryCode": "CM", "operator": "ORANGE_CM" }
    ]
  }'`
      }]
    },

    // ---------------------------------------------------------------
    {
      id: 'list-messages',
      method: 'GET',
      path: '/messages',
      title: 'Lister les messages',
      auth: 'Bearer (clé API ou JWT)',
      intro: `Retourne l'historique paginé de vos messages, filtrable par statut et recherche libre.`,
      paramTables: [
        {
          heading: 'Paramètres de requête (query)',
          rows: [
            { name: 'page', type: 'Integer', required: false, description: 'Numéro de page, défaut 0.' },
            { name: 'size', type: 'Integer', required: false, description: 'Taille de page, défaut 20.' },
            { name: 'direction', type: 'String', required: false, description: 'INBOUND ou OUTBOUND.' },
            { name: 'status', type: 'String', required: false, description: 'Filtre sur le statut (ex: DELIVERED, FAILED).' },
            { name: 'search', type: 'String', required: false, description: 'Recherche libre (numéro, contenu).' }
          ]
        }
      ],
      snippets: [{
        label: 'cURL',
        code: `curl -G "${BASE_URL}/messages" \\
  -H "Authorization: Bearer VOTRE_CLE_API" \\
  --data-urlencode "page=0" \\
  --data-urlencode "size=20" \\
  --data-urlencode "status=DELIVERED"`
      }]
    },

    // ---------------------------------------------------------------
    {
      id: 'message-stats',
      method: 'GET',
      path: '/messages/stats',
      title: 'Statistiques des messages',
      auth: 'Bearer (clé API ou JWT)',
      intro: `Retourne les compteurs agrégés utiles pour un tableau de bord : totaux envoyés/reçus/échoués/livrés, ainsi que les compteurs du jour (UTC).`,
      paramTables: [
        {
          heading: 'Champs de la réponse',
          rows: [
            { name: 'totalSent', type: 'Long', required: true, description: 'Nombre total de messages sortants envoyés.' },
            { name: 'totalReceived', type: 'Long', required: true, description: 'Nombre total de messages entrants reçus.' },
            { name: 'totalFailed', type: 'Long', required: true, description: "Nombre total d'échecs d'envoi." },
            { name: 'totalDelivered', type: 'Long', required: true, description: 'Nombre total de messages sortants confirmés livrés.' },
            { name: 'sentToday', type: 'Long', required: true, description: "Envoyés aujourd'hui (UTC)." },
            { name: 'receivedToday', type: 'Long', required: true, description: "Reçus aujourd'hui (UTC)." }
          ]
        }
      ],
      snippets: [{
        label: 'cURL',
        code: `curl -X GET ${BASE_URL}/messages/stats \\
  -H "Authorization: Bearer VOTRE_CLE_API"`
      }]
    },

    // ---------------------------------------------------------------
    {
      id: 'devices-pair',
      method: 'POST',
      path: '/devices/pair',
      title: 'Pairer un device',
      auth: 'Aucune (appelée par l\'app mobile TNB avec le code de connexion du compte)',
      intro: `Utilisée par l'application mobile Android TNB au moment de connecter un nouveau téléphone à votre compte. Le code de connexion est réutilisable sur plusieurs devices et se génère depuis votre dashboard.`,
      paramTables: [
        {
          heading: 'Corps de la requête',
          rows: [
            { name: 'pairingCode', type: 'String', required: true, description: 'Code de connexion généré depuis le dashboard.' },
            { name: 'countryCode', type: 'String', required: true, description: 'Pays détecté sur la carte SIM du téléphone.' }
          ]
        }
      ],
      snippets: [{
        label: 'cURL',
        code: `curl -X POST ${BASE_URL}/devices/pair \\
  -H "Content-Type: application/json" \\
  -d '{ "pairingCode": "ABC123", "countryCode": "CM" }'`
      }]
    },

    // ---------------------------------------------------------------
    {
      id: 'devices-manage',
      method: 'GET',
      path: '/devices',
      title: 'Gérer les devices',
      auth: 'Bearer (JWT ou clé API)',
      intro: `Consultez et administrez vos devices connectés en mode BYOD.`,
      notes: [
        `GET /devices/{id} — détail d'un device précis.`,
        `PATCH /devices/{id} — modifie le label ou le pays d'un device.`,
        `POST /devices/{id}/revoke — bloque immédiatement ce device sans affecter les autres devices pairés avec le même code de connexion.`,
        `DELETE /devices/{id} — suppression (soft delete).`
      ],
      snippets: [{
        label: 'cURL',
        code: `# Lister
curl -X GET ${BASE_URL}/devices \\
  -H "Authorization: Bearer VOTRE_CLE_API"

# Révoquer
curl -X POST ${BASE_URL}/devices/{id}/revoke \\
  -H "Authorization: Bearer VOTRE_JWT"`
      }]
    },

    // ---------------------------------------------------------------
    {
      id: 'devices-sims',
      method: 'PATCH',
      path: '/devices/{deviceId}/sims/{simId}',
      title: 'Gérer les SIMs',
      auth: 'Bearer (JWT)',
      intro: `Chaque device peut porter plusieurs SIMs. Consultez-les avec GET /devices/{deviceId}/sims, puis ajustez l'opérateur, l'état actif/inactif ou le quota quotidien d'une SIM précise.`,
      paramTables: [
        {
          heading: 'Corps de la requête PATCH',
          rows: [
            { name: 'operator', type: 'String', required: false, description: "Code opérateur — doit appartenir au pays du device, sinon 400." },
            { name: 'active', type: 'Boolean', required: false, description: 'Active ou désactive la SIM pour le routage.' },
            { name: 'dailyQuota', type: 'Integer', required: false, description: "Plafond d'envoi quotidien pour cette SIM." }
          ]
        }
      ],
      snippets: [{
        label: 'cURL',
        code: `curl -X PATCH ${BASE_URL}/devices/{deviceId}/sims/{simId} \\
  -H "Authorization: Bearer VOTRE_JWT" \\
  -H "Content-Type: application/json" \\
  -d '{ "active": true, "dailyQuota": 400 }'`
      }]
    },

    // ---------------------------------------------------------------
    {
      id: 'webhooks',
      method: 'PUT',
      path: '/webhook',
      title: 'Configurer un webhook',
      auth: 'Bearer (JWT)',
      intro: `Recevez en temps réel les SMS entrants et les mises à jour de statut sur votre propre serveur.`,
      notes: [
        `GET /webhook — consulte la configuration actuelle.`,
        `POST /webhook/test — déclenche un envoi de test vers votre URL configurée et retourne le code HTTP reçu.`,
        `POST /webhook/secret/rotate — génère un nouveau secret de signature (l'ancien est immédiatement invalidé).`
      ],
      paramTables: [
        {
          heading: 'Corps de la requête PUT',
          rows: [
            { name: 'webhookUrl', type: 'String', required: true, description: 'URL HTTPS de votre endpoint qui recevra les notifications.' }
          ]
        }
      ],
      snippets: [{
        label: 'cURL',
        code: `curl -X PUT ${BASE_URL}/webhook \\
  -H "Authorization: Bearer VOTRE_JWT" \\
  -H "Content-Type: application/json" \\
  -d '{ "webhookUrl": "https://mon-entreprise.com/api/sms-reception" }'`
      }]
    },

    // ---------------------------------------------------------------
    {
      id: 'coverage',
      method: 'GET',
      path: '/coverage',
      title: 'Couverture réseau',
      auth: 'Bearer (clé API ou JWT)',
      intro: `Retourne, pour chaque pays, les opérateurs disponibles avec le nombre de devices actifs, de SIMs actives et la capacité d'envoi quotidienne estimée — utile pour vérifier la disponibilité avant un envoi massif.`,
      snippets: [{
        label: 'cURL',
        code: `curl -X GET ${BASE_URL}/coverage \\
  -H "Authorization: Bearer VOTRE_CLE_API"

# { "countries": [ { "countryCode": "CM", "countryName": "Cameroun",
#     "operators": [ { "operatorCode": "MTN_CM", "operatorName": "MTN",
#       "availableDevices": 2, "activeSims": 4, "dailyCapacity": 400 } ] } ] }`
      }]
    },

    // ---------------------------------------------------------------
    {
      id: 'reference',
      method: 'GET',
      path: '/reference/countries',
      title: 'Pays & opérateurs',
      auth: 'Bearer (clé API ou JWT)',
      intro: `Référentiel statique des pays et opérateurs supportés, à utiliser pour valider vos formulaires avant l'envoi.`,
      notes: [
        `GET /reference/countries — liste des pays supportés.`,
        `GET /reference/countries/{code}/operators — opérateurs disponibles pour un pays.`,
        `GET /reference/countries/{code}/validate — vérifie qu'un code pays est valide.`,
        `GET /reference/operators/{code}/validate — vérifie qu'un code opérateur est valide.`
      ],
      snippets: [{
        label: 'cURL',
        code: `curl -X GET ${BASE_URL}/reference/countries/CM/operators \\
  -H "Authorization: Bearer VOTRE_CLE_API"`
      }]
    }
  ];

  errorCodes: ErrorCodeRow[] = [
    { code: 'MISSING_API_KEY', status: '401', description: "Aucune clé API fournie dans le header Authorization." },
    { code: 'API_KEY_REVOKED', status: '401', description: 'La clé API utilisée a été révoquée.' },
    { code: 'INVALID_TOKEN', status: '401', description: 'Token JWT invalide ou expiré.' },
    { code: 'INSUFFICIENT_SCOPE', status: '403', description: "Le scope de la clé API ne permet pas cette action (ex: READ_ONLY sur /send)." },
    { code: 'INVALID_ARGUMENT', status: '400', description: 'Un ou plusieurs champs de la requête sont invalides — voir validationErrors.' },
    { code: 'OPERATOR_COUNTRY_MISMATCH', status: '400', description: "Le code opérateur ne correspond pas au pays fourni." },
    { code: 'NO_DEVICE_FOR_COUNTRY_OPERATOR', status: '422', description: "Aucun device disponible pour ce couple pays/opérateur au moment de l'envoi." },
    { code: 'DEVICE_NOT_FOUND', status: '404', description: "Le device demandé n'existe pas ou ne vous appartient pas." },
    { code: 'DEVICE_NOT_ONLINE', status: '422', description: "Le device ciblé est actuellement hors ligne." },
    { code: 'DEVICE_SIM_ERROR', status: '400', description: "Erreur de configuration sur la SIM du device (quota, opérateur...)." },
    { code: 'MESSAGE_NOT_FOUND', status: '404', description: "Le message demandé n'existe pas ou ne vous appartient pas." },
    { code: 'INVALID_PAIRING_CODE', status: '400', description: 'Code de connexion invalide, expiré ou révoqué.' },
    { code: 'INVALID_OTP', status: '400', description: 'Code OTP incorrect.' },
    { code: 'OTP_EXPIRED', status: '400', description: 'Le code OTP a expiré, redemandez-en un.' },
    { code: 'TOO_MANY_OTP_REQUESTS', status: '429', description: "Trop de demandes d'OTP successives, réessayez plus tard." },
    { code: 'WEBHOOK_DELIVERY_FAILED', status: '—', description: "Échec de livraison vers votre URL de webhook (visible dans l'historique des appels)." },
    { code: 'WEBHOOK_ERROR', status: '400', description: 'Configuration de webhook invalide (URL malformée...).' }
  ];

  activeSection = computed<DocSection>(() => {
    return this.sections.find(s => s.id === this.activeId()) ?? this.sections[0];
  });

  filteredNavSections = computed<DocNavSection[]>(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.navSections;
    return this.navSections
      .map(section => ({
        ...section,
        links: section.links.filter(l => l.label.toLowerCase().includes(q))
      }))
      .filter(section => section.links.length > 0);
  });

  selectSection(id: string) {
    this.activeId.set(id);
  }

  async copyBaseUrl() {
    try {
      await navigator.clipboard.writeText(this.baseUrl);
      this.copiedUrl.set(true);
      setTimeout(() => this.copiedUrl.set(false), 1800);
    } catch {
      // Presse-papiers indisponible : on ignore silencieusement.
    }
  }
}
