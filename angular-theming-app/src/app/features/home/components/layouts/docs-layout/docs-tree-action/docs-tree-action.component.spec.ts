import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsTreeActionComponent } from './docs-tree-action.component';

describe('DocsTreeActionComponent', () => {
  let component: DocsTreeActionComponent;
  let fixture: ComponentFixture<DocsTreeActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsTreeActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocsTreeActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
