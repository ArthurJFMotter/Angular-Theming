import { Component, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { TreeNode } from '../../../../../core/models/tree.model';
import { DynamicTreeComponent } from '../../../../../shared/components/dynamic-tree/dynamic-tree.component';
import { MatIconModule } from '@angular/material/icon';

// MOCK DATA + payload
const DOCS_DATA: TreeNode[] = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    icon: 'rocket_launch',
    children: [
      {
        id: 'installation',
        label: 'Installation',
        data: {
          title: 'Installation',
          body: "Install the library and its peer dependency (Google's Material Color Utilities) via NPM. No additional Material components are bundled, keeping the footprint tiny.",
          code: 'npm install ng-material-preferences @material/material-color-utilities',
        },
      },
      {
        id: 'configuration',
        label: 'Configuration',
        data: {
          title: 'Zero-Config Setup',
          body: "Simply call providePreferences() in your app.config.ts. This automatically registers the LocalStorage engine and hooks into Angular's ENVIRONMENT_INITIALIZER to boot the CSS engine.",
          code: `import { providePreferences } from 'ng-material-preferences';\n\nexport const appConfig = {\n  providers: [\n    providePreferences()\n  ]\n};`,
        },
      },
      {
        id: 'architecture',
        label: 'Architecture',
        data: {
          title: 'Headless & Tree-Shakeable',
          body: 'The library is split into 5 distinct domains (Color, Typography, Layout, Notifications, Accessibility). You can omit entire domains to drastically reduce bundle size.',
          code: `providePreferences({\n  accessibility: false, // Strips SVG filters\n  notifications: false  // Strips position logic\n})`,
        },
      },
    ],
  },
  {
    id: 'domains',
    label: 'Theming Domains',
    icon: 'palette',
    children: [
      {
        id: 'color-domain',
        label: 'Color & Appearance',
        children: [
          {
            id: 'custom-profiles',
            label: 'Custom Profiles',
            data: {
              title: 'Custom Profiles',
              body: 'Generate full M3 tonal palettes dynamically from a single primary hex code. You can also lock in secondary, tertiary, or semantic colors explicitly.',
              code: `prefs.setCustomColors({\n  primary: '#ff00aa',\n  warning: '#ffcc00'\n});`,
            },
          },
          {
            id: 'scheme-variants',
            label: 'Scheme Variants',
            data: {
              title: 'Material 3 Scheme Variants',
              body: 'Material Color Utilities (MCU) allows transforming a single hex color into vastly different emotional palettes. Variants include Vibrant, Monochrome, and Expressive.',
              code: `prefs.setVariant('monochrome');`,
            },
          },
        ],
      },
      {
        id: 'typography-domain',
        label: 'Typography',
        children: [
          {
            id: 'font-families',
            label: 'Font Families',
            data: {
              title: 'Dynamic Font Injection',
              body: 'The library intercepts font family selections and automatically injects Google Fonts <link> tags into the document head, mapping them to the --mat-sys CSS variables.',
              code: `prefs.setHeadingFontFamily('Montserrat');\nprefs.setBodyFontFamily('Inter');`,
            },
          },
          {
            id: 'size-scaling',
            label: 'Size Scaling',
            data: {
              title: 'Fluid Typography Scaling',
              body: 'Scale readability across the app. All Material typography tokens (font-size and line-height) are dynamically multiplied by the current fontScale.',
              code: `prefs.setFontScale(1.15); // Large`,
            },
          },
        ],
      },
      {
        id: 'layout-domain',
        label: 'Interface Layout',
        children: [
          {
            id: 'density',
            label: 'Density',
            data: {
              title: 'Density Control',
              body: "Changes the data-theme-density attribute on the HTML root. Angular Material's SCSS mixins react to this attribute, shrinking component heights and paddings.",
              code: `prefs.setDensityScale(-3); // Maximum compact`,
            },
          },
          {
            id: 'corner-radius',
            label: 'Corner Radius',
            data: {
              title: 'Shape Scaling',
              body: 'Multiplies the base border-radius tokens (--mat-sys-corner-small, etc). Dragging it to 0 creates perfectly sharp corners. Standard buttons are mapped to the extra-large curve.',
              code: `prefs.setShapeScale(0); // Sharp edges`,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'a11y',
    label: 'Accessibility (A11y)',
    icon: 'accessibility_new',
    children: [
      {
        id: 'vision-simulator',
        label: 'Vision Simulator',
        data: {
          title: 'Environmental Filters',
          body: 'Apply real-time CSS and SVG filters to the entire application. Simulates Astigmatism (halation/bloom), Glare, Macular Degeneration, and Glaucoma.',
          code: `prefs.setScreenFilter('astigmatism');\nprefs.setScreenFilterIntensity(80);`,
        },
      },
      {
        id: 'daltonization',
        label: 'Daltonization Math',
        data: {
          title: 'Colorblindness Compensation',
          body: 'Not only can you simulate what a colorblind user sees, but the engine can mathematically shift missing hues into visible channels (Daltonization) to force contrast.',
          code: `prefs.setCvdMode('protanopia');\nprefs.setCvdIntent('compensate');`,
        },
      },
      {
        id: 'reduced-motion',
        label: 'Reduced Motion',
        data: {
          title: 'Motion & Animation Killer',
          body: "Respect vestibular disorders by disabling all CSS animations. Combine with Angular's [@.disabled] host binding to completely freeze all Material dialogs and ripples.",
          code: `// App.component.ts\n@HostBinding('@.disabled')\nget animationsDisabled() {\n  return this.prefs.motionScale() === 0;\n}`,
        },
      },
    ],
  },
];

@Component({
  selector: 'app-docs-layout',
  standalone: true,
  imports: [MatDividerModule, MatIconModule, DynamicTreeComponent],
  templateUrl: './docs-layout.component.html',
  styleUrl: './docs-layout.component.scss',
})
export class DocsLayoutComponent {
  readonly treeData = DOCS_DATA;
  readonly activeDoc = signal<any | null>(null);

  onNodeSelected(node: TreeNode) {
    // Only update the view if the node actually has article payload data
    if (node.data) {
      this.activeDoc.set(node.data);
    }
  }
}
