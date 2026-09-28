import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerAccessibilityComponent } from './drawer-accessibility.component';

describe('DrawerAccessibilityComponent', () => {
  let component: DrawerAccessibilityComponent;
  let fixture: ComponentFixture<DrawerAccessibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerAccessibilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawerAccessibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
