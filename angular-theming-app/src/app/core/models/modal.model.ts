// --- INTERFACES ---
export interface ModalInput {
  id: string;
  label: string;
  value: any;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  isRequired?: boolean;
}
export interface ModalSelectOption {
  label: string;
  value: any;
}
export interface ModalSelect {
  id: string;
  label: string;
  value: any;
  options: ModalSelectOption[];
  isRequired?: boolean;
}
export interface ModalToggle {
  id: string;
  label: string;
  checked: boolean;
}

export interface ModalChecklistOption {
  id: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
}

export interface ModalAction {
  label: string;
  value?: any;
  color?: 'primary' | 'accent' | 'warn';
  isPrimary?: boolean;
  returnsPayload?: boolean;
}

export interface ModalData {
  title: string;
  message: string;
  previewSnippet?: string;
  icon?: string;
  showCloseButton?: boolean;
  inputs?: ModalInput[];
  checklist?: ModalChecklistOption[];
  selects?: ModalSelect[];
  toggles?: ModalToggle[];
  actions?: ModalAction[];
}
