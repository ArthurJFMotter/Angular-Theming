import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface SelectOption {
  value: any;
  label: string;
  desc?: string; // Optional
}

@Component({
  selector: 'app-preference-select',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './preference-select.component.html',
  styleUrl: './preference-select.component.scss',
})
export class PreferenceSelectComponent {
  @Input() label?: string;
  @Input({ required: true }) value: any;
  @Input({ required: true }) options: SelectOption[] = [];
  @Input() disabled = false;

  @Output() valueChange = new EventEmitter<any>();

  get selectedLabel(): string {
    return (
      this.options.find((o) => o.value === this.value)?.label || this.value
    );
  }
}
