import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceSelectComponent } from './preference-select.component';

describe('PreferencesSelectComponent', () => {
  let component: PreferenceSelectComponent;
  let fixture: ComponentFixture<PreferenceSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferenceSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreferenceSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
