import { Component, ChangeDetectionStrategy, signal, inject, AfterViewInit, OnDestroy, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

// Material Imports for the Sandbox
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';

import { PreferencesService } from 'ng-material-preferences';
import { NotificationService } from '../../core/services/notification.service';
import { AppUiStateService } from '../../core/services/app-ui-state.service';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush, 
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatButtonModule,MatButtonToggleModule, MatIconModule, MatChipsModule, MatFormFieldModule,
    MatInputModule, MatSlideToggleModule, MatProgressBarModule, MatProgressSpinnerModule,
    MatDividerModule, MatTabsModule, MatBadgeModule, MatSelectModule,
    MatCardModule, MatCheckboxModule, MatRadioModule, MatExpansionModule, MatSliderModule, MatToolbarModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  readonly prefs = inject(PreferencesService);
  readonly notify = inject(NotificationService);
  readonly uiState = inject(AppUiStateService);

  readonly viewMode = signal<'components' | 'compositions'>('components');
  readonly activeSection = signal<string>('actions');

  @ViewChildren('spyTarget') spyTargets!: QueryList<ElementRef<HTMLElement>>;
  private observer: IntersectionObserver | null = null;

  // Form control to demonstrate the Error state in inputs!
  emailControl = new FormControl('', [Validators.required, Validators.email]);

  constructor() {
    this.emailControl.markAsTouched();
    
    // Automatically switch to Drawer mode on desktop for the ultimate Sandbox experience
    if (!this.uiState.isMobile()?.matches && this.uiState.widgetMode() !== 'drawer') {
      this.uiState.widgetMode.set('drawer');
    }
  }

  ngAfterViewInit() {
    this.observer = new IntersectionObserver((entries) => {
      const visible = entries.find(e => e.isIntersecting);
      if (visible) this.activeSection.set(visible.target.id);
    }, { rootMargin: '-100px 0px -60% 0px' });

    this.spyTargets.forEach(target => this.observer?.observe(target.nativeElement));
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  scrollTo(id: string) {
    this.activeSection.set(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: this.prefs.motionScale() === 0 ? 'instant' : 'smooth', block: 'start' });
    }
  }

  triggerToast(type: 'success' | 'warning' | 'info' | 'error') {
    this.notify.show(type, `This is a simulated ${type} alert.`, { label: 'Dismiss', actionFn: () => {} });
  }
}