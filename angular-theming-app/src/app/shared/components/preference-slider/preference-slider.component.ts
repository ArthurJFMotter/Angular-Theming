import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ScaleDefinition } from 'ng-material-preferences';

@Component({
  selector: 'app-preference-slider',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './preference-slider.component.html',
  styleUrl: './preference-slider.component.scss',
})
export class PreferenceSliderComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: number;
  @Input({ required: true }) scale!: ScaleDefinition;

  @Input() displayValue?: string | null;
  @Input() disabled = false;
  @Input() highlight = false;

  @Output() valueChange = new EventEmitter<number>();

  increase() {
    if (this.value < this.scale.max)
      this.onValueChange(this.value + this.scale.step);
  }

  decrease() {
    if (this.value > this.scale.min)
      this.onValueChange(this.value - this.scale.step);
  }

  onValueChange(newVal: number) {
    // Automatically fixes JS floating-point math errors (e.g. 1.1500000000000001 -> 1.15)
    const rounded = Math.round(newVal * 100) / 100;
    this.valueChange.emit(rounded);
  }
}
