import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesSideDrawerComponent } from './preferences-side-drawer.component';

describe('PreferencesSideDrawerComponent', () => {
  let component: PreferencesSideDrawerComponent;
  let fixture: ComponentFixture<PreferencesSideDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferencesSideDrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreferencesSideDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
