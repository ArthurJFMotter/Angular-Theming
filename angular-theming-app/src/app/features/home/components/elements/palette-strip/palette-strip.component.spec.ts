import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaletteStripComponent } from './palette-strip.component';

describe('PaletteStripComponent', () => {
  let component: PaletteStripComponent;
  let fixture: ComponentFixture<PaletteStripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaletteStripComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaletteStripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
