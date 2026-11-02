import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanActionsComponent } from './kanban-actions.component';

describe('KanbanActionsComponent', () => {
  let component: KanbanActionsComponent;
  let fixture: ComponentFixture<KanbanActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KanbanActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
