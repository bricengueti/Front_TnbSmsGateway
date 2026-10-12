import { Directive, ElementRef, Input, OnInit, OnDestroy, inject } from '@angular/core';

/**
 * Révèle un élément (fondu + léger déplacement vers le haut) quand il entre
 * dans le viewport. Volontairement discret : 24px de déplacement, 550ms —
 * un renfort de lecture, jamais un effet de démonstration.
 *
 * Usage : <div uiReveal [uiRevealDelay]="80">...</div>
 */
@Directive({
  selector: '[uiReveal]',
  standalone: true
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  @Input() uiRevealDelay = 0;

  private el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngOnInit() {
    const node = this.el.nativeElement;
    node.classList.add('ui-reveal');

    // Respecte les préférences d'accessibilité (réduction de mouvement).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.classList.add('ui-reveal--visible');
      return;
    }

    node.style.transitionDelay = `${this.uiRevealDelay}ms`;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            node.classList.add('ui-reveal--visible');
            this.observer?.unobserve(node);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    this.observer.observe(node);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
