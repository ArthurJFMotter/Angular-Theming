import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ElementsViewComponent } from './components/elements/elements-view/elements-view.component';
import { LayoutsViewComponent } from './components/layouts/layouts-view/layouts-view.component';
import { SandboxNavComponent } from './components/navigation/sandbox-nav/sandbox-nav.component';
import { ELEMENT_SECTIONS, LAYOUT_SECTIONS } from './data/sandbox.data';
import { SandboxViewMode } from './models/sandbox.model';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush, 
  imports: [SandboxNavComponent, ElementsViewComponent, LayoutsViewComponent],
    templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly elements = ELEMENT_SECTIONS;
  readonly layouts = LAYOUT_SECTIONS;

  readonly viewMode = signal<SandboxViewMode>('elements');
  readonly activeSectionId = signal<string>(this.elements[0].id);

  currentSections() {
    return this.viewMode() === 'elements' ? this.elements : this.layouts;
  }

  switchMode(mode: SandboxViewMode) {
    this.viewMode.set(mode);
    this.activeSectionId.set(mode === 'elements' ? this.elements[0].id : this.layouts[0].id);
  }
}