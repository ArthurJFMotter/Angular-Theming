import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PreferencesService } from 'ng-material-preferences';
import { ElementsViewComponent } from './components/elements/elements-view/elements-view.component';
import { LayoutsViewComponent } from './components/layouts/layouts-view/layouts-view.component';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush, 
  imports: [CommonModule, MatButtonToggleModule, ElementsViewComponent, LayoutsViewComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly prefs = inject(PreferencesService);
  
  readonly viewMode = signal<'elements' | 'layouts'>('elements');
  readonly activeSection = signal<string>('actions');

  scrollTo(id: string) {
    this.activeSection.set(id);
    document.getElementById(id)?.scrollIntoView({ 
      behavior: this.prefs.motionScale() === 0 ? 'instant' : 'smooth', 
      block: 'start' 
    });
  }
}