import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../../../../core/services/notification.service';
import { DocsStateService } from './services/docs-state.service';

export interface DocArticle {
  id: string;
  title: string;
  badge: string;
  badgeType: 'info' | 'success' | 'warning';
  lead: string;
  codeSnippet: string;
}

export interface DocNode {
  id: string;
  name: string;
  icon?: string;
  children?: DocNode[];
  article?: DocArticle;
}

const TREE_DATA: DocNode[] = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    icon: 'rocket_launch',
    article: {
      id: 'getting-started',
      title: 'Installation & Setup',
      badge: 'v1.0.0',
      badgeType: 'info',
      lead: 'Quick installation and zero-config root provider setup for Angular Material 3 applications.',
      codeSnippet: `import { providePreferences } from 'ng-material-preferences';

export const appConfig: ApplicationConfig = {
  providers: [
    providePreferences({
      disableRemoteFonts: false,
      notifications: true,
      defaultTheme: 'system',
    }),
  ],
};`,
    },
  },
  {
    id: 'theming-domains',
    name: 'Theming Domains',
    icon: 'palette',
    children: [
      {
        id: 'color-appearance',
        name: 'Color & Appearance',
        article: {
          id: 'color-appearance',
          title: 'Dynamic M3 Palette Generation',
          badge: 'M3 Sys',
          badgeType: 'success',
          lead: 'Runtime tonal palette generation using the Material 3 color algorithms and CSS variables.',
          codeSnippet: `// Apply custom color roles at runtime
prefs.setCustomColors({
  primary: '#6750A4',
  secondary: '#625B71',
  tertiary: '#7D5260',
});`,
        },
      },
      {
        id: 'typography',
        name: 'Typography',
        children: [
          {
            id: 'font-families',
            name: 'Font Families',
            article: {
              id: 'font-families',
              title: 'Dynamic Font Injection',
              badge: 'v1.1.0',
              badgeType: 'info',
              lead: 'The library intercepts font family selections and automatically injects Google Fonts <link> tags into the document head, mapping them to the --mat-sys CSS variables.',
              codeSnippet: `prefs.setHeadingFontFamily('Montserrat');
prefs.setBodyFontFamily('Inter');`,
            },
          },
          {
            id: 'size-scaling',
            name: 'Size Scaling',
            article: {
              id: 'size-scaling',
              title: 'Dynamic Typography Scaling',
              badge: 'A11y',
              badgeType: 'info',
              lead: 'Scales all Material 3 typography tokens relative to the root rem scale without breaking element layout boundaries.',
              codeSnippet: `// Scale between 80% (0.8) and 130% (1.3)
prefs.setFontScale(1.15);`,
            },
          },
        ],
      },
      {
        id: 'interface-layout',
        name: 'Interface Layout',
        article: {
          id: 'interface-layout',
          title: 'Corner Radius & Shape Tokens',
          badge: 'Tokens',
          badgeType: 'info',
          lead: 'Global corner radius modifiers that proportionally scale all M3 shape containers from 0px (sharp) to full pill rounding.',
          codeSnippet: `// Scale corner radius (0 to 1)
prefs.setCornerRadiusScale(0); // Sharp corners across all components`,
        },
      },
    ],
  },
  {
    id: 'accessibility',
    name: 'Accessibility (A11y)',
    icon: 'accessibility_new',
    children: [
      {
        id: 'vision-simulator',
        name: 'Vision Simulator',
        article: {
          id: 'vision-simulator',
          title: 'Color Vision Deficiency Simulator',
          badge: 'WCAG',
          badgeType: 'warning',
          lead: 'Real-time SVG matrix filters applied to document canvas for testing Protanopia, Deuteranopia, Tritanopia, and Achromatopsia.',
          codeSnippet: `prefs.setColorDeficiency('deuteranopia');`,
        },
      },
      {
        id: 'daltonization',
        name: 'Daltonization Math',
        article: {
          id: 'daltonization',
          title: 'Color Correction (Daltonization)',
          badge: 'Math',
          badgeType: 'warning',
          lead: 'Corrective shift matrices designed to restore lost contrast for specific color deficiency types.',
          codeSnippet: `prefs.enableDaltonizationCorrection(true);`,
        },
      },
      {
        id: 'reduced-motion',
        name: 'Reduced Motion',
        article: {
          id: 'reduced-motion',
          title: 'Reduced Motion & Scale Dampening',
          badge: 'Motion',
          badgeType: 'info',
          lead: 'Coordinates with prefers-reduced-motion media query and sets --theme-motion-scale to 0 for instant, accessible transitions.',
          codeSnippet: `prefs.setMotionScale(0); // Completely disables transition durations`,
        },
      },
    ],
  },
];

@Component({
  selector: 'app-docs-layout',
  standalone: true,
  imports: [CommonModule, MatTreeModule, MatIconModule, MatButtonModule],
  templateUrl: './docs-layout.component.html',
  styleUrl: './docs-layout.component.scss',
})
export class DocsLayoutComponent implements OnInit {
  private readonly docsState = inject(DocsStateService);
  private readonly notify = inject(NotificationService, { optional: true });

  readonly treeControl = new NestedTreeControl<DocNode>(
    (node) => node.children,
  );
  readonly dataSource = new MatTreeNestedDataSource<DocNode>();

  readonly selectedNodeId = signal<string>('getting-started');

  // Currently displayed article
  readonly currentArticle = computed<DocArticle | null>(() => {
    const id = this.selectedNodeId();
    return this.findArticleById(TREE_DATA, id);
  });

  hasChild = (_: number, node: DocNode) =>
    !!node.children && node.children.length > 0;

  ngOnInit(): void {
    this.dataSource.data = TREE_DATA;

    this.docsState.registerTreeHandlers(
      () => this.expandAllRecursive(this.dataSource.data),
      () => this.treeControl.collapseAll(),
    );

  }

  selectNode(node: DocNode): void {
    if (node.article) {
      this.selectedNodeId.set(node.id);
    } else if (node.children?.length) {
      // If clicking a category row without its own article, toggle its folder
      this.treeControl.toggle(node);
    }
  }

  copyCode(): void {
    const code = this.currentArticle()?.codeSnippet;
    if (code) {
      navigator.clipboard.writeText(code).then(() => {
        this.notify?.show('success', 'Code snippet copied to clipboard!');
      });
    }
  }

  private expandAllRecursive(nodes: DocNode[]): void {
    for (const node of nodes) {
      if (node.children?.length) {
        this.treeControl.expand(node);
        this.expandAllRecursive(node.children);
      }
    }
  }

  private findArticleById(nodes: DocNode[], id: string): DocArticle | null {
    for (const node of nodes) {
      if (node.id === id && node.article) {
        return node.article;
      }
      if (node.children?.length) {
        const found = this.findArticleById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }
}
