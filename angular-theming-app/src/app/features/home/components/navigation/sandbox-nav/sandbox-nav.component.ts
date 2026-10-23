import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SandboxViewMode, SandboxSection } from '../../../models/sandbox.model';

@Component({
  selector: 'app-sandbox-nav',
  standalone: true,
  imports: [MatButtonToggleModule],
  templateUrl: './sandbox-nav.component.html',
  styleUrl: './sandbox-nav.component.scss'
})
export class SandboxNavComponent {
  @Input({ required: true }) viewMode!: SandboxViewMode;
  @Input({ required: true }) sections: SandboxSection[] = [];
  @Input({ required: true }) activeSectionId!: string;

  @Output() viewModeChange = new EventEmitter<SandboxViewMode>();

  onModeChange(mode: SandboxViewMode) {
    this.viewModeChange.emit(mode);
  }

  scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}