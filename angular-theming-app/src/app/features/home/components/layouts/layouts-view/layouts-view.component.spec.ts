import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutsViewComponent } from './layouts-view.component';

describe('LayoutsViewComponent', () => {
  let component: LayoutsViewComponent;
  let fixture: ComponentFixture<LayoutsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
