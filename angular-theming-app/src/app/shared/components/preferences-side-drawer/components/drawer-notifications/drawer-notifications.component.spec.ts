import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerNotificationsComponent } from './drawer-notifications.component';

describe('DrawerNotificationsComponent', () => {
  let component: DrawerNotificationsComponent;
  let fixture: ComponentFixture<DrawerNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawerNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
