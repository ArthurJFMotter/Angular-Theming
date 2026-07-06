import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeSyncService } from './core/services/theme-sync.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-theming-app';

  constructor(private themeSync: ThemeSyncService) {}
}
