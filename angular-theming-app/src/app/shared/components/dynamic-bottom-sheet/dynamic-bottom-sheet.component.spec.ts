import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicBottomSheetComponent } from './dynamic-bottom-sheet.component';

describe('DynamicBottomSheetComponent', () => {
  let component: DynamicBottomSheetComponent;
  let fixture: ComponentFixture<DynamicBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicBottomSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
