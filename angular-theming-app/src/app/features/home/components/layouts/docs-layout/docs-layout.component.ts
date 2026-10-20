import { Component } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

interface DocNode {
  name: string;
  icon?: string;
  children?: DocNode[];
}

const TREE_DATA: DocNode[] = [
  {
    name: 'Getting Started',
    icon: 'rocket_launch',
    children: [
      { name: 'Installation' },
      { name: 'Configuration' },
      { name: 'Architecture' },
    ],
  },
  {
    name: 'Theming Domains',
    icon: 'palette',
    children: [
      {
        name: 'Color & Appearance',
        children: [{ name: 'Custom Profiles' }, { name: 'Scheme Variants' }],
      },
      {
        name: 'Typography',
        children: [{ name: 'Font Families' }, { name: 'Size Scaling' }],
      },
      {
        name: 'Interface Layout',
        children: [{ name: 'Density' }, { name: 'Corner Radius' }],
      },
    ],
  },
  {
    name: 'Accessibility (A11y)',
    icon: 'accessibility_new',
    children: [
      { name: 'Vision Simulator' },
      { name: 'Daltonization Math' },
      { name: 'Reduced Motion' },
    ],
  },
];

@Component({
  selector: 'app-docs-layout',
  standalone: true,
  imports: [MatTreeModule, MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './docs-layout.component.html',
  styleUrl: './docs-layout.component.scss',
})
export class DocsLayoutComponent {
  dataSource = TREE_DATA;

  readonly childrenAccessor = (node: DocNode): DocNode[] =>
    node.children ?? [];

  hasChild = (_: number, node: DocNode) =>
    !!node.children && node.children.length > 0;
}
