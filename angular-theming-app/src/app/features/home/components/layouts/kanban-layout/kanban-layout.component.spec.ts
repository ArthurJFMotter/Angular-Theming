import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanLayoutComponent } from './kanban-layout.component';

describe('KanbanLayoutComponent', () => {
  let component: KanbanLayoutComponent;
  let fixture: ComponentFixture<KanbanLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KanbanLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
