// ELEMENTS
import { ActionsSectionComponent } from '../components/elements/actions-section/actions-section.component';
import { FeedbackSectionComponent } from '../components/elements/feedback-section/feedback-section.component';
import { InputsSectionComponent } from '../components/elements/inputs-section/inputs-section.component';
import { OverlaysSectionComponent } from '../components/elements/overlays-section/overlays-section.component';
import { PaletteStripComponent } from '../components/elements/palette-strip/palette-strip.component';
import { SurfacesSectionComponent } from '../components/elements/surfaces-section/surfaces-section.component';
//LAYOUTS
import { CheckoutLayoutComponent } from '../components/layouts/checkout-layout/checkout-layout.component';
import { DashboardLayoutComponent } from '../components/layouts/dashboard-layout/dashboard-layout.component';
import { DocsLayoutComponent } from '../components/layouts/docs-layout/docs-layout.component';
import { KanbanLayoutComponent } from '../components/layouts/kanban-layout/kanban-layout.component';
import { MobileFrameLayoutComponent } from '../components/layouts/mobile-frame-layout/mobile-frame-layout.component';
import { TableLayoutComponent } from '../components/layouts/table-layout/table-layout.component';

import { SandboxSection } from '../models/sandbox.model';

export const ELEMENT_SECTIONS: SandboxSection[] = [
  { id: 'palletes', title: 'Palettes', component: PaletteStripComponent },
  { id: 'actions', title: 'Actions', component: ActionsSectionComponent },
  { id: 'inputs', title: 'Inputs & Forms', component: InputsSectionComponent },
  {
    id: 'surfaces',
    title: 'Surfaces & Containers',
    component: SurfacesSectionComponent,
  },
  { id: 'overlays', title: 'Overlays', component: OverlaysSectionComponent },
  {
    id: 'feedback',
    title: 'Feedback & Alerts',
    component: FeedbackSectionComponent,
  },
];

export const LAYOUT_SECTIONS: SandboxSection[] = [
  {
    id: 'dashboard',
    title: 'Analytics Dashboard',
    description:
      'Tests tertiary usage, token mapping to charts, and data density.',
    component: DashboardLayoutComponent,
  },
  {
    id: 'table',
    title: 'Data Table View',
    description:
      'Tests dense list structures, hover states, and pagination scales.',
    component: TableLayoutComponent,
  },
  {
    id: 'checkout',
    title: 'Checkout Wizard',
    description:
      'Tests Stepper integration, multi-stage form validation, and layout wrapping.',
    component: CheckoutLayoutComponent,
  },
  {
    id: 'docs',
    title: 'Documentation Browser',
    description:
      'Tests nested MatTree integration, deep typography hierarchies, and surface contrasts.',
    component: DocsLayoutComponent,
  },
  {
    id: 'kanban',
    title: 'Kanban Project Board',
    description: 'Tests surface hierarchy, elevation, and card corner radii.',
    component: KanbanLayoutComponent,
  },
  {
    id: 'mobile',
    title: 'Mobile Frame',
    description:
      'Tests constrained small-screen density, bottom sheets, and FABs.',
    component: MobileFrameLayoutComponent,
    hideOnMobile: true,
  },
];
