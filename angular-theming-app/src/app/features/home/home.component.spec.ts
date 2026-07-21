import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { HomeComponent } from './home.component';
import { PreferencesService } from 'ng-material-preferences';
import { NotificationService } from '../../core/services/notification.service';
import { ModalService } from '../../core/services/modal.service';

describe('HomeComponent - Domain Omission & Wiring', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockPrefs: any;
  let mockNotify: any;
  let mockModals: any;

  beforeEach(async () => {
    // Mock the Library Facade
    mockPrefs = {
      hasNotifications: false,
      hasColor: true, 
      
      // Explicitly disable the other domains so the drawer doesn't try to render them
      hasTypography: false,
      hasLayout: false,
      hasAccessibility: false,

      snackbarHPosition: signal('center'),
      snackbarVPosition: signal('bottom'),
      activeCustomColors: signal({ primary: '#3b6fd6' }), // Mock for paletteSwatches()
      
      savedProfiles: signal([]),
      scheme: signal('custom'),
      customColors: signal({ primary: '#3b6fd6' }),
      mode: signal('auto'),
      variant: signal('tonal-spot'),
      contrastLevel: signal(0),
      autoContrast: signal(true)
    };

    // Mock the App-Level Services
    mockNotify = {
      show: jasmine.createSpy('show')
    };
    mockModals = {
      initModalDialog: jasmine.createSpy('initModalDialog'),
      initModalBottomSheet: jasmine.createSpy('initModalBottomSheet')
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent, NoopAnimationsModule],
      providers: [
        { provide: PreferencesService, useValue: mockPrefs },
        { provide: NotificationService, useValue: mockNotify },
        { provide: ModalService, useValue: mockModals }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  describe('Domain Omission', () => {
    it('should NOT render snackbar controls when Notifications domain is omitted', () => {
      mockPrefs.hasNotifications = false;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.snackbar-controls')).toBeNull();
      expect(compiled.textContent).not.toContain('Vertical Spawn');
    });

    it('should render snackbar controls when Notifications domain is present', () => {
      mockPrefs.hasNotifications = true;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.snackbar-controls')).toBeTruthy();
      expect(compiled.textContent).toContain('Vertical Spawn');
    });
  });

  describe('Architectural Wiring', () => {
    it('should route snackbar triggers through the NotificationService pipeline', () => {
      // Act
      component.triggerSnackbar('success');
      
      // Assert it didn't bypass the architecture and try to open a snackbar locally
      expect(mockNotify.show).toHaveBeenCalledWith('success', 'Changes saved successfully!');
    });
  });
});