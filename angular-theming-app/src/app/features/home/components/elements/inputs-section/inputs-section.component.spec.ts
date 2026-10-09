import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputsSectionComponent } from './inputs-section.component';

describe('InputsSectionComponent', () => {
  let component: InputsSectionComponent;
  let fixture: ComponentFixture<InputsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputsSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
