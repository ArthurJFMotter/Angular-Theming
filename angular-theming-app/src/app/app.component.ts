import { Component, computed, HostBinding, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PreferencesService } from 'ng-material-preferences';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-theming-app';
  private prefs = inject(PreferencesService);

  @HostBinding('@.disabled')
  get animationsDisabled() {
    return this.prefs.motionScale() === 0;
  }
}
