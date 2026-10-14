/**
 * Built-in types, plus any role name (e.g. an extended color such as 'brand').
 * `(string & {})` keeps editor autocomplete for the literals while still
 * accepting arbitrary role names (a bare `| string` collapses the union).
 */
export type NotificationType =
  | 'default'
  | 'success'
  | 'warning'
  | 'info'
  | 'error'
  | (string & {});

export interface NotificationAction {
  label: string;
  actionFn: () => void;
}

export interface NotificationData {
  message: string;
  type: NotificationType;
  icon?: string;
  action?: NotificationAction;
}