import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementsViewComponent } from './elements-view.component';

describe('ElementsViewComponent', () => {
  let component: ElementsViewComponent;
  let fixture: ComponentFixture<ElementsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElementsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElementsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
