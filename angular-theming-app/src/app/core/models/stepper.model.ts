export type StepActionType =
  | 'next'
  | 'previous'
  | 'reset'
  | 'submit'
  | 'custom';
export type StepContentType = 'form' | 'confirmation' | 'message';

export interface StepField {
  key: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'number';
  required?: boolean;
}

export interface StepAction {
  label: string;
  type: StepActionType;
  color?: 'primary' | 'accent' | 'warn';
  isPrimary?: boolean;
  customClass?: string; // e.g., 'btn-success-container'
  actionFn?: (data?: any) => void;
}

export interface StepperStep {
  id: string;
  label: string;
  optional?: boolean;
  contentType: StepContentType;

  // For 'form' types
  fields?: StepField[];

  // For 'confirmation' or 'message' types
  message?: string;
  icon?: string;

  actions: StepAction[];
}

export interface StepperConfig {
  linear?: boolean;
  orientation?: 'horizontal' | 'vertical'; // Default orientation
  steps: StepperStep[];
}
