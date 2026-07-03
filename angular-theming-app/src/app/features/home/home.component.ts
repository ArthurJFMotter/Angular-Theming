import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { PreferencesSideDrawerComponent } from '../../shared/components/preferences-side-drawer/preferences-side-drawer.component';
import { NotificationService } from '../../core/services/notification.service';
import { ModalService } from '../../core/services/modal.service';

import { MatSidenavModule } from '@angular/material/sidenav';
import { ReadAloudDirective } from '../../shared/directives/read-aloud.directive';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { I18nService } from '../../core/services/i18n.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatDividerModule,
    MatTabsModule,
    MatTooltipModule,
    MatBadgeModule,
    MatSelectModule,
    MatSidenavModule,
    PreferencesSideDrawerComponent,
    TranslatePipe,
    ReadAloudDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly notify = inject(NotificationService);
  readonly modals = inject(ModalService);
  readonly i18n = inject(I18nService);

  readonly chips = ['Angular', 'Material 3', 'SCSS', 'Signals'];

  triggerSnackbar(type: 'default' | 'success' | 'warning' | 'info' | 'error') {
    let msgKey = 'home.snackbars.msg.default';

    if (type === 'success') msgKey = 'home.alerts.success';
    if (type === 'warning') msgKey = 'home.alerts.warning';
    if (type === 'info') msgKey = 'home.alerts.info';
    if (type === 'error') msgKey = 'home.snackbars.msg.error';

    this.notify.show(type, this.i18n.translate(msgKey));
  }

  openDialog() {
    this.modals.initModalDialog();
  }

  openBottomSheet() {
    this.modals.initModalBottomSheet();
  }
}
