import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlaysSectionComponent } from './overlays-section.component';

describe('OverlaysSectionComponent', () => {
  let component: OverlaysSectionComponent;
  let fixture: ComponentFixture<OverlaysSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlaysSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverlaysSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
