import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerColorComponent } from './drawer-color.component';

describe('DrawerColorComponent', () => {
  let component: DrawerColorComponent;
  let fixture: ComponentFixture<DrawerColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerColorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawerColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
