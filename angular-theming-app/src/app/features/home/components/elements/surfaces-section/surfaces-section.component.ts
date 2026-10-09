import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-surfaces-section',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatExpansionModule],
  templateUrl: './surfaces-section.component.html',
  styleUrl: './surfaces-section.component.scss',
})
export class SurfacesSectionComponent {}
