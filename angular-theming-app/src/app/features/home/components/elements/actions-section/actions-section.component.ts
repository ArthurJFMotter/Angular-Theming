import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-actions-section',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './actions-section.component.html',
  styleUrl: './actions-section.component.scss',
})
export class ActionsSectionComponent {}
