import {
  ModalAction,
  ModalChecklistOption,
  ModalInput,
  ModalSelect,
  ModalToggle,
} from './modal.model';

export interface BottomSheetItem {
  id?: string;
  label: string;
  sublabel?: string;
  icon?: string;
  value: any;
  color?: 'primary' | 'accent' | 'warn';
  disabled?: boolean;
}

export interface BottomSheetData {
  title?: string;
  subtitle?: string;
  icon?: string;
  message?: string;
  showDragHandle?: boolean; // Defaults to true
  showCloseButton?: boolean;

  // Code or snippet display
  previewSnippet?: string;

  // Action / Option List (classic M3 bottom sheet)
  items?: BottomSheetItem[];

  // Dynamic Forms support (same as DynamicModal)
  inputs?: ModalInput[];
  selects?: ModalSelect[];
  toggles?: ModalToggle[];
  checklist?: ModalChecklistOption[];

  // Footer Actions (Cancel, Confirm, etc.)
  actions?: ModalAction[];
}