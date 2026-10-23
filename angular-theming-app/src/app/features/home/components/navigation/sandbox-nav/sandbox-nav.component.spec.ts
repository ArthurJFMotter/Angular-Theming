import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SandboxNavComponent } from './sandbox-nav.component';

describe('SandboxNavComponent', () => {
  let component: SandboxNavComponent;
  let fixture: ComponentFixture<SandboxNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SandboxNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SandboxNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
