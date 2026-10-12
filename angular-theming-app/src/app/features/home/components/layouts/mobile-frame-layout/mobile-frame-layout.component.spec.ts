import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileFrameLayoutComponent } from './mobile-frame-layout.component';

describe('MobileFrameLayoutComponent', () => {
  let component: MobileFrameLayoutComponent;
  let fixture: ComponentFixture<MobileFrameLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileFrameLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileFrameLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
