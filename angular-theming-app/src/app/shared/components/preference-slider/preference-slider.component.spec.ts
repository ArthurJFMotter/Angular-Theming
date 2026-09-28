import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesSliderComponent } from './preference-slider.component';

describe('PreferencesSliderComponent', () => {
  let component: PreferencesSliderComponent;
  let fixture: ComponentFixture<PreferencesSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferencesSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreferencesSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
