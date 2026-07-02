import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBottomSheetComponent } from './modal-bottom-sheet.component';

describe('ModalBottomSheetComponent', () => {
  let component: ModalBottomSheetComponent;
  let fixture: ComponentFixture<ModalBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalBottomSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
