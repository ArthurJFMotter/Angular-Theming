import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { PreferencesSideDrawerComponent } from './preferences-side-drawer.component';
import { PreferencesService } from 'ng-material-preferences';

describe('PreferencesSideDrawerComponent - Domain Omission', () => {
  let component: PreferencesSideDrawerComponent;
  let fixture: ComponentFixture<PreferencesSideDrawerComponent>;
  let mockPrefs: any;

  beforeEach(async () => {
    // 1. Mock the Facade. We start with ALL domains omitted (false).
    mockPrefs = {
      hasColor: false,
      hasTypography: false,
      hasLayout: false,
      hasAccessibility: false,
      hasNotifications: false,
      
      // Provide dummy signals so the template doesn't crash during evaluation
      savedProfiles: signal([]), scheme: signal('custom'), customColors: signal({ primary: '#000' }),
      mode: signal('auto'), variant: signal('tonal-spot'), contrastLevel: signal(0), autoContrast: signal(true),
      headingFontFamily: signal('Roboto'), bodyFontFamily: signal('Roboto'), fontScale: signal(1),
      shapeScale: signal(1), densityScale: signal(0), motionScale: signal(1),
      cvd: signal('none'), cvdIntent: signal('simulate'), cvdSeverity: signal(100),
      screenFilter: signal('none'), screenFilterIntensity: signal(50)
    };

    await TestBed.configureTestingModule({
      imports: [PreferencesSideDrawerComponent, NoopAnimationsModule],
      providers: [
        { provide: PreferencesService, useValue: mockPrefs }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PreferencesSideDrawerComponent);
    component = fixture.componentInstance;
  });

  it('should NOT render any sections when all domains are omitted', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.textContent).not.toContain('Color Scheme');
    expect(compiled.textContent).not.toContain('Typography');
    expect(compiled.textContent).not.toContain('Interface');
    expect(compiled.textContent).not.toContain('Vision Simulator');
  });

  it('should render ONLY the Color sections when hasColor is true', () => {
    mockPrefs.hasColor = true; // Turn on Color
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.textContent).toContain('Color Scheme');
    expect(compiled.textContent).toContain('Appearance');
    // Typography should still be hidden
    expect(compiled.textContent).not.toContain('Typography'); 
  });

  it('should render ONLY the Typography section when hasTypography is true', () => {
    mockPrefs.hasTypography = true; // Turn on Typography
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.textContent).toContain('Typography');
    expect(compiled.textContent).not.toContain('Color Scheme');
  });
});