import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerLayoutComponent } from './drawer-layout.component';

describe('DrawerLayoutComponent', () => {
  let component: DrawerLayoutComponent;
  let fixture: ComponentFixture<DrawerLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawerLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
