import {
  Component,
  inject,
  Input,
  OnInit,
  OnDestroy,
  signal,
  HostBinding,
  computed,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { Subscription } from 'rxjs';

import { PreferencesService } from 'ng-material-preferences';
import { AppUiStateService } from '../../../core/services/app-ui-state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  readonly uiState = inject(AppUiStateService);
  readonly prefs = inject(PreferencesService);
  private scrollDispatcher = inject(ScrollDispatcher);

  @Input({ required: true }) drawer!: MatSidenav;

  readonly isDrawerMode = computed(
    () => this.uiState.widgetMode() === 'drawer',
  );
  readonly drawerPos = computed(() => this.uiState.drawerConfig().position);
  readonly drawerIcon = computed(() => 'menu');

  private scrollSub!: Subscription;
  private lastScrollY = 0;
  readonly isVisible = signal(true);

  @HostBinding('class.navbar-hidden')
  get hidden() {
    if (this.prefs.motionScale() === 0) return false;
    return !this.isVisible();
  }

  ngOnInit() {
    this.scrollSub = this.scrollDispatcher
      .scrolled(20)
      .subscribe((scrollable) => {
        let offset = 0;
        if (
          scrollable &&
          typeof scrollable !== 'string' &&
          scrollable.measureScrollOffset
        ) {
          offset = scrollable.measureScrollOffset('top');
        } else {
          offset = window.scrollY || document.documentElement.scrollTop;
        }

        if (offset < 50) this.isVisible.set(true);
        else if (offset > this.lastScrollY + 10) this.isVisible.set(false);
        else if (offset < this.lastScrollY - 10) this.isVisible.set(true);

        this.lastScrollY = offset;
      });
  }

  ngOnDestroy() {
    this.scrollSub?.unsubscribe();
  }
}
