import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerTypographyComponent } from './drawer-typography.component';

describe('DrawerTypographyComponent', () => {
  let component: DrawerTypographyComponent;
  let fixture: ComponentFixture<DrawerTypographyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerTypographyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawerTypographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
