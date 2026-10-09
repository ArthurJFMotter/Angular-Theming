export type NotificationType =
  | 'default'
  | 'success'
  | 'warning'
  | 'info'
  | 'error';

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
