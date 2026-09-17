// --- INTERFACES ---
export interface ModalAction {
  label: string;
  value?: any; // The value returned when this button is clicked
  color?: 'primary' | 'accent' | 'warn';
  isPrimary?: boolean;
}

export interface ModalData {
  title: string;
  message: string;
  previewSnippet?: string;
  icon?: string;
  showCloseButton?: boolean;
  actions?: ModalAction[];
}