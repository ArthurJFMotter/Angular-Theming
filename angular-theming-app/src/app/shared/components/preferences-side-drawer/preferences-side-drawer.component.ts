import { Component, inject, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { PreferencesService } from 'ng-material-preferences';
import { ModalService } from '../../../core/services/modal.service';
import { DrawerColorComponent } from './components/drawer-color/drawer-color.component';
import { DrawerLayoutComponent } from './components/drawer-layout/drawer-layout.component';
import { DrawerTypographyComponent } from './components/drawer-typography/drawer-typography.component';
import { DrawerAccessibilityComponent } from './components/drawer-accessibility/drawer-accessibility.component';
import { DrawerNotificationsComponent } from './components/drawer-notifications/drawer-notifications.component';

@Component({
  selector: 'app-preferences-side-drawer',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    DrawerAccessibilityComponent,
    DrawerColorComponent,
    DrawerLayoutComponent,
    DrawerNotificationsComponent,
    DrawerTypographyComponent,
  ],
  templateUrl: './preferences-side-drawer.component.html',
  styleUrl: './preferences-side-drawer.component.scss',
})
export class PreferencesSideDrawerComponent {
  readonly prefs = inject(PreferencesService);
  private modals = inject(ModalService);

  @Output() closeDrawer = new EventEmitter<void>();

  confirmReset(): void {
    this.modals
      .confirmDanger(
        'Reset All Preferences',
        'Are you sure you want to restore everything to the factory defaults?',
        'restore',
      )
      .subscribe((confirmed) => {
        if (confirmed) this.prefs.resetToDefaults();
      });
  }
}
