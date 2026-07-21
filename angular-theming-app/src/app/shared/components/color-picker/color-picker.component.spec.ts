import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal, computed } from '@angular/core';
import { ColorPickerComponent } from './color-picker.component';
import { PreferencesService } from 'ng-material-preferences';

describe('ColorPickerComponent - Domain Omission', () => {
  let fixture: ComponentFixture<ColorPickerComponent>;
  let mockPrefs: any;

  beforeEach(async () => {
    mockPrefs = {
      hasColor: false, // Default to omitted
      scheme: signal('custom'),
      activeCustomColors: signal({ primary: '#3b6fd6' }),
      activeProfile: signal(undefined),
      canCreateColorProfile: signal(true),
      suggestedColorsDefaults: () => ({ primary: '#3b6fd6', secondary: '#000', tertiary: '#000', error: '#000' })
    };

    await TestBed.configureTestingModule({
      imports: [ColorPickerComponent, NoopAnimationsModule],
      providers: [
        { provide: PreferencesService, useValue: mockPrefs }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ColorPickerComponent);
  });

  it('should render the disabled fallback message when Color domain is omitted', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.textContent).toContain('Color preferences are disabled');
    expect(compiled.querySelector('.color-swatch-input')).toBeNull(); // No inputs should exist
  });

  it('should render the full picker UI when Color domain is present', () => {
    mockPrefs.hasColor = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.textContent).not.toContain('disabled in this application');
    expect(compiled.textContent).toContain('Custom theme colors');
    expect(compiled.querySelector('.color-swatch-input')).toBeTruthy();
  });
});