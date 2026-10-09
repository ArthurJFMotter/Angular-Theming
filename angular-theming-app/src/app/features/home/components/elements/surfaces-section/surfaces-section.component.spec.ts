import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurfacesSectionComponent } from './surfaces-section.component';

describe('SurfacesSectionComponent', () => {
  let component: SurfacesSectionComponent;
  let fixture: ComponentFixture<SurfacesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurfacesSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurfacesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
