import { Type } from '@angular/core';

export type SandboxViewMode = 'elements' | 'layouts';

export interface SandboxSection {
  id: string;
  title: string;
  description?: string;
  component: Type<any>; // The Angular Component to dynamically render
  actionTemplate?: Type<any>;
  hideOnMobile?: boolean;
}
