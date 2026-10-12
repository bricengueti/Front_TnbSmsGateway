import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiPricingCardComponent } from '../../../shared/ui/pricing-card/ui-pricing-card.component';
import { UiFaqAccordionComponent, UiFaqItem } from '../../../shared/ui/faq-accordion/ui-faq-accordion.component';

type BillingCycle = 'monthly' | 'yearly';

interface PlanDef {
  name: string;
  subtitle: string;
  monthlyPrice: number;
  currency: string;
  popular?: boolean;
  emphasis?: 'default' | 'primary';
  features?: string[];
  ctaLabel: string;
}

interface ComparisonRow {
  feature: string;
  pool: string;
  byod: string;
  poolIcon?: 'check' | 'close';
  byodIcon?: 'check' | 'close';
}

const ANNUAL_DISCOUNT = 0.2; // -20% affiché sur le cycle annuel

@Component({
  selector: 'app-rate',
  standalone: true,
  imports: [CommonModule, UiPricingCardComponent, UiFaqAccordionComponent],
  templateUrl: './rate.component.html',
  styleUrl: './rate.component.scss'
})
export class RateComponent {

  billingCycle = signal<BillingCycle>('monthly');

  setBilling(cycle: BillingCycle) {
    this.billingCycle.set(cycle);
  }

  poolPlans: PlanDef[] = [
    { name: 'Pack Starter', subtitle: '10 000 crédits SMS', monthlyPrice: 5000, currency: 'XAF', ctaLabel: 'Acheter des crédits' },
    {
      name: 'Pack Pro', subtitle: '50 000 crédits SMS', monthlyPrice: 22500, currency: 'XAF',
      popular: true, emphasis: 'primary', ctaLabel: 'Acheter des crédits',
      features: ['Priorité de routage standard', 'Support par email']
    }
  ];

  byodPlans: PlanDef[] = [
    {
      name: 'Single Device', subtitle: '1 Appareil connecté', monthlyPrice: 15000, currency: 'XAF',
      ctaLabel: 'Souscrire', features: ['Envoi SMS illimité (selon forfait SIM)', 'Intégration API REST']
    },
    {
      name: 'Scale Fleet', subtitle: "Jusqu'à 5 Appareils", monthlyPrice: 50000, currency: 'XAF',
      ctaLabel: 'Souscrire', features: ['Load balancing entre appareils', 'Webhook de statut en temps réel']
    }
  ];

  /** Prix affiché + période, recalculés à chaque changement de cycle. */
  displayPrice(plan: PlanDef): { amount: string; period: string; strike?: string } {
    if (this.billingCycle() === 'monthly') {
      return {
        amount: plan.monthlyPrice.toLocaleString('fr-FR'),
        period: `${plan.currency}/mois`
      };
    }
    const annualTotal = Math.round(plan.monthlyPrice * 12 * (1 - ANNUAL_DISCOUNT));
    const fullPrice = plan.monthlyPrice * 12;
    return {
      amount: annualTotal.toLocaleString('fr-FR'),
      period: `${plan.currency}/an`,
      strike: fullPrice.toLocaleString('fr-FR')
    };
  }

  comparison: ComparisonRow[] = [
    { feature: 'Fournisseur de ligne', pool: 'TNB (Numéros partagés)', byod: 'Votre propre carte SIM' },
    { feature: "Limite d'envoi", pool: 'Selon crédits achetés', byod: 'Illimité (selon opérateur)' },
    { feature: 'Réception de SMS (Inbound)', pool: '', byod: '', poolIcon: 'close', byodIcon: 'check' },
    { feature: 'Débit d\'envoi (Throttling)', pool: 'Élevé (Multiples routes)', byod: 'Modéré (Dépendant du device)' }
  ];

  faqItems: UiFaqItem[] = [
    {
      question: 'Acceptez-vous le paiement par Mobile Money ?',
      answer: `Oui, nous supportons les paiements via MTN Mobile Money, Orange Money, Moov Africa et Airtel Money dans la zone CEMAC. Le rechargement de vos crédits sur le pool partagé est instantané après validation du paiement.`
    },
    {
      question: 'Comment fonctionnent les quotas pour le BYOD ?',
      answer: `En mode BYOD, vous payez uniquement pour la connexion de votre appareil à notre plateforme. Vous ne payez aucun crédit SMS chez nous. Les frais d'envoi de SMS sont directement déduits du crédit de la carte SIM insérée dans votre appareil par votre opérateur local.`
    },
    {
      question: "Puis-je changer d'offre en cours de mois ?",
      answer: `Les crédits du pool partagé n'expirent jamais. Pour les abonnements BYOD, vous pouvez ajouter de nouveaux appareils à tout moment avec une facturation au prorata des jours restants dans le mois.`
    },
    {
      question: "L'engagement annuel est-il remboursable ?",
      answer: `L'abonnement annuel est facturé en une fois avec 20% de remise par rapport au tarif mensuel. En cas de résiliation anticipée, le solde non consommé est converti en crédits utilisables sur le pool partagé.`
    }
  ];
}
