import { Component, HostBinding, inject, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import { PreferencesService } from 'ng-material-preferences';
import { AppUiStateService } from './core/services/app-ui-state.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { PreferencesSideDrawerComponent } from './shared/components/preferences-side-drawer/preferences-side-drawer.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    FooterComponent,
    NavbarComponent,
    PreferencesSideDrawerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-theming-app';

  private prefs = inject(PreferencesService);
  readonly uiState = inject(AppUiStateService);

  // Kills Angular JS-driven animations on the component tree when Motion is 0
  @HostBinding('@.disabled')
  get animationsDisabled() {
    return this.prefs.motionScale() === 0;
  }
}