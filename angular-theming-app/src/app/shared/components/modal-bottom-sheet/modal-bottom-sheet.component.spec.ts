import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { signal } from '@angular/core';
import { ModalBottomSheetComponent } from './modal-bottom-sheet.component';
import { PreferencesService } from 'ng-material-preferences';
import { NotificationService } from '../../../core/services/notification.service';

describe('ModalBottomSheetComponent - Domain Omission', () => {
  let fixture: ComponentFixture<ModalBottomSheetComponent>;
  let mockPrefs: any;

  beforeEach(async () => {
    mockPrefs = {
      hasColor: false, // Default to omitted!
      activeCustomColors: signal({ primary: '#000' })
    };

    await TestBed.configureTestingModule({
      imports: [ModalBottomSheetComponent, NoopAnimationsModule],
      providers: [
        { provide: PreferencesService, useValue: mockPrefs },
        { provide: NotificationService, useValue: { show: jasmine.createSpy() } },
        { provide: MatBottomSheetRef, useValue: { dismiss: jasmine.createSpy() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalBottomSheetComponent);
  });

  it('should render the fallback warning if the Color domain is omitted', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.textContent).toContain('Feature Unavailable');
    expect(compiled.textContent).toContain('Color Preferences module is not installed');
    expect(compiled.textContent).not.toContain('Export'); // The export UI should be hidden
  });

  it('should render the export UI if the Color domain is present', () => {
    mockPrefs.hasColor = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.textContent).not.toContain('Feature Unavailable');
    expect(compiled.textContent).toContain('Export');
    expect(compiled.textContent).toContain('Import');
  });
});