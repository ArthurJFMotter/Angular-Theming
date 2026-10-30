import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileRotateActionComponent } from './mobile-rotate-action.component';

describe('MobileRotateActionComponent', () => {
  let component: MobileRotateActionComponent;
  let fixture: ComponentFixture<MobileRotateActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileRotateActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileRotateActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
