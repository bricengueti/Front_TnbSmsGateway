import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';

export interface UiCodeSnippet {
  label: string;
  code: string;
  /** Langage Prism explicite. Déduit depuis `label` si omis (cURL → bash, Node.js → javascript...). */
  language?: string;
}

const LABEL_TO_LANG: Record<string, string> = {
  'curl': 'bash',
  'bash': 'bash',
  'shell': 'bash',
  'node.js': 'javascript',
  'nodejs': 'javascript',
  'javascript': 'javascript',
  'js': 'javascript',
  'python': 'python',
  'java': 'java',
  'json': 'json'
};

/**
 * Bloc de code sombre réutilisable avec coloration syntaxique fidèle au thème
 * "Dark+" de VS Code (via Prism.js). Deux variantes :
 *  - "terminal" : fenêtre avec pastilles macOS + titre — page d'accueil
 *  - "tabs"     : onglets par langage — page documentation
 * Bouton copier fonctionnel dans les deux cas.
 */
@Component({
  selector: 'app-ui-code-block',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-code-block.component.html',
  styleUrl: './ui-code-block.component.scss'
})
export class UiCodeBlockComponent {
  @Input() variant: 'terminal' | 'tabs' = 'terminal';
  @Input() title = '';
  @Input() snippets: UiCodeSnippet[] = [];
  @Input() responseStatus?: string;
  @Input() responseTime?: string;

  activeIndex = signal(0);
  copied = signal(false);

  constructor(private sanitizer: DomSanitizer) {}

  get activeSnippet(): UiCodeSnippet | undefined {
    return this.snippets[this.activeIndex()];
  }

  /** Code de l'onglet actif, coloré syntaxiquement (VS Code Dark+) via Prism. */
  highlightedCode = computed<SafeHtml>(() => {
    const snippet = this.snippets[this.activeIndex()];
    if (!snippet) return this.sanitizer.bypassSecurityTrustHtml('');

    const lang = (snippet.language ?? LABEL_TO_LANG[snippet.label.toLowerCase()] ?? 'bash');
    const grammar = Prism.languages[lang] ?? Prism.languages['bash'];

    let html: string;
    try {
      html = Prism.highlight(snippet.code, grammar, lang);
    } catch {
      html = snippet.code;
    }
    return this.sanitizer.bypassSecurityTrustHtml(html);
  });

  selectTab(i: number) {
    this.activeIndex.set(i);
  }

  async copy() {
    const code = this.activeSnippet?.code ?? '';
    try {
      await navigator.clipboard.writeText(code);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1800);
    } catch {
      // Presse-papiers indisponible (ex: contexte non sécurisé) : on ignore silencieusement.
    }
  }
}
