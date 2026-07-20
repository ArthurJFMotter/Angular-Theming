import { TestBed } from '@angular/core/testing';
import { NotificationPreferencesService } from './notification-preferences.service';

describe('NotificationPreferencesService', () => {
  let service: NotificationPreferencesService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [NotificationPreferencesService] });
    service = TestBed.inject(NotificationPreferencesService);
  });

  it('should snapshot and patch state safely', () => {
    service.patchState({ snackbarHPosition: 'end', snackbarVPosition: 'top' });
    const snap = service.getSnapshot();
    expect(snap.snackbarHPosition).toBe('end');
    expect(snap.snackbarVPosition).toBe('top');
  });

  it('should reset back to defaults', () => {
    service.setSnackbarHPosition('left');
    service.reset();
    expect(service.snackbarHPosition()).toBe('center'); // The default
  });
});