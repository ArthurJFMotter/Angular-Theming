import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-mobile-frame-layout',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './mobile-frame-layout.component.html',
  styleUrl: './mobile-frame-layout.component.scss',
})
export class MobileFrameLayoutComponent {}
