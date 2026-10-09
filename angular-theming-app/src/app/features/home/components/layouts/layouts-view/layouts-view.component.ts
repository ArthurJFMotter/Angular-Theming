import { Component, AfterViewInit, OnDestroy, ElementRef, QueryList, ViewChildren, Output, EventEmitter } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-layouts-view',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule, MatDividerModule, MatTableModule, MatPaginatorModule, MatChipsModule],
  template: `
    <!-- 1. ANALYTICS DASHBOARD -->
    <section id="dashboard" #spyTarget class="canvas-section compositions">
      <h2 class="section-title">Analytics Dashboard</h2>
      <p class="section-desc">Tests tertiary usage, token mapping to charts, and data density.</p>
      
      <div class="mock-dashboard">
        <mat-toolbar color="primary" class="mock-toolbar">
          <mat-icon>insights</mat-icon><span>Q3 Analytics</span><span style="flex: 1"></span>
          <button mat-icon-button><mat-icon>account_circle</mat-icon></button>
        </mat-toolbar>
        
        <div class="dashboard-body">
          <div class="stats-row">
            <mat-card appearance="outlined"><div class="stat"><h3 style="color: var(--mat-sys-primary)">$42.4K</h3><p>Revenue</p></div></mat-card>
            <mat-card appearance="outlined"><div class="stat"><h3 style="color: var(--mat-sys-tertiary)">1,204</h3><p>New Users</p></div></mat-card>
            <mat-card appearance="outlined" style="background: var(--mat-sys-error-container); color: var(--mat-sys-on-error-container)"><div class="stat"><h3>14</h3><p>Active Alerts</p></div></mat-card>
          </div>

          <div class="chart-mock">
            <!-- Simulated Bar Chart using semantic & core colors -->
            <div class="bar" style="height: 40%; background: var(--mat-sys-primary)"></div>
            <div class="bar" style="height: 70%; background: var(--mat-sys-secondary)"></div>
            <div class="bar" style="height: 50%; background: var(--mat-sys-tertiary)"></div>
            <div class="bar" style="height: 90%; background: var(--mat-sys-primary)"></div>
            <div class="bar" style="height: 30%; background: var(--mat-sys-error)"></div>
          </div>
        </div>
      </div>
    </section>
    <mat-divider></mat-divider>

    <!-- 2. DATA TABLE -->
    <section id="table" #spyTarget class="canvas-section compositions">
      <h2 class="section-title">Data Table View</h2>
      <p class="section-desc">Tests dense list structures, hover states, and pagination scales.</p>
      
      <mat-card appearance="outlined" class="table-card">
        <div class="table-toolbar">
          <mat-chip-listbox>
            <mat-chip-option selected>All Users</mat-chip-option>
            <mat-chip-option>Active</mat-chip-option>
            <mat-chip-option>Pending</mat-chip-option>
          </mat-chip-listbox>
          <span style="flex: 1"></span>
          <button mat-flat-button color="primary"><mat-icon>add</mat-icon> Invite</button>
        </div>
        
        <table mat-table [dataSource]="dataSource" class="mat-elevation-z0">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef> Name </th>
            <td mat-cell *matCellDef="let element"> {{element.name}} </td>
          </ng-container>
          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef> Role </th>
            <td mat-cell *matCellDef="let element"> {{element.role}} </td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Status </th>
            <td mat-cell *matCellDef="let element">
              <!-- Using Semantic Container Colors! -->
              <span class="badge" [style.background]="'var(--mat-sys-' + element.statusColor + '-container)'" [style.color]="'var(--mat-sys-on-' + element.statusColor + '-container)'">
                {{element.status}}
              </span>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <mat-paginator [pageSizeOptions]="[5, 10]" showFirstLastButtons></mat-paginator>
      </mat-card>
    </section>
    <mat-divider></mat-divider>

    <!-- 3. KANBAN BOARD -->
    <section id="kanban" #spyTarget class="canvas-section compositions">
      <h2 class="section-title">Kanban Project Board</h2>
      <p class="section-desc">Tests surface hierarchy, elevation, and card corner radii.</p>
      
      <div class="kanban-board">
        <div class="kanban-col">
          <h4>To Do (2)</h4>
          <mat-card appearance="raised" class="kanban-card">
            <p>Update authentication flow tokens</p>
            <span class="badge warning">High Priority</span>
          </mat-card>
          <mat-card appearance="raised" class="kanban-card">
            <p>Write API Documentation</p>
            <span class="badge info">Docs</span>
          </mat-card>
        </div>
        <div class="kanban-col">
          <h4>In Progress (1)</h4>
          <mat-card appearance="raised" class="kanban-card">
            <p>Refactor SCSS mixins for M3</p>
            <div class="avatar" style="background: var(--mat-sys-primary); color: var(--mat-sys-on-primary)">AM</div>
          </mat-card>
        </div>
        <div class="kanban-col">
          <h4>Done (1)</h4>
          <mat-card appearance="raised" class="kanban-card">
            <p>Fix density clipping bug</p>
            <span class="badge success">Deployed</span>
          </mat-card>
        </div>
      </div>
    </section>
    <mat-divider></mat-divider>

    <!-- 4. MOBILE APP FRAME -->
    <section id="mobile" #spyTarget class="canvas-section compositions">
      <h2 class="section-title">Mobile Frame</h2>
      <p class="section-desc">Tests constrained small-screen density, bottom sheets, and FABs.</p>
      
      <div class="mobile-frame-wrapper">
        <div class="mobile-device">
          <mat-toolbar color="primary" style="height: 56px;"><mat-icon>menu</mat-icon><span style="font-size: 1rem; margin-left: 12px;">Inbox</span></mat-toolbar>
          <div class="mobile-content">
            <div class="mock-list-item">
              <div class="avatar" style="background: var(--mat-sys-tertiary-container); color: var(--mat-sys-on-tertiary-container)">S</div>
              <div class="text"><strong>Sarah Jenkins</strong><br><small>Meeting notes from Tuesday</small></div>
            </div>
            <mat-divider></mat-divider>
            <div class="mock-list-item">
              <div class="avatar" style="background: var(--mat-sys-secondary-container); color: var(--mat-sys-on-secondary-container)">M</div>
              <div class="text"><strong>Marketing Team</strong><br><small>New branding assets approved</small></div>
            </div>
            <button mat-fab color="tertiary" class="mobile-fab"><mat-icon>edit</mat-icon></button>
          </div>
          <div class="mock-bottom-nav">
            <mat-icon color="primary">mail</mat-icon>
            <mat-icon>videocam</mat-icon>
            <mat-icon>group</mat-icon>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @use '../../sandbox-shared.scss';
    .canvas-section { padding-bottom: 64px; scroll-margin-top: 100px; padding-top: 48px; margin-top: 24px; border-top: 1px solid var(--mat-sys-outline-variant); }
    .canvas-section:first-child { border-top: none; padding-top: 0; margin-top: 0; }
    .section-title { font-size: 1.5rem; font-weight: 600; margin: 0 0 8px; color: var(--mat-sys-on-background); }
    .section-desc { font-size: 0.9rem; color: var(--mat-sys-on-surface-variant); margin: 0 0 32px; }
    
    /* Dashboard */
    .mock-dashboard { background: var(--mat-sys-surface-container-lowest); border: 1px solid var(--mat-sys-outline-variant); border-radius: var(--mat-sys-corner-extra-large); overflow: hidden; }
    .mock-toolbar { border-radius: 0; gap: 12px; font-size: 1.1rem; font-weight: 500; }
    .dashboard-body { padding: 32px; display: flex; flex-direction: column; gap: 32px; }
    .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; }
    .stat { padding: 24px 16px; text-align: center; h3 { font-size: 2rem; font-weight: 700; margin: 0 0 8px; } p { margin: 0; font-size: 0.85rem; opacity: 0.8; text-transform: uppercase; } }
    .chart-mock { display: flex; align-items: flex-end; justify-content: space-around; height: 150px; padding: 24px; background: var(--mat-sys-surface-container); border-radius: var(--mat-sys-corner-large); }
    .chart-mock .bar { width: 15%; border-radius: 4px 4px 0 0; }

    /* Table */
    .table-card { padding: 0; overflow: hidden; }
    .table-toolbar { display: flex; padding: 16px 24px; border-bottom: 1px solid var(--mat-sys-outline-variant); background: var(--mat-sys-surface-container-lowest); align-items: center; flex-wrap: wrap; gap: 16px;}
    .badge { font-size: 0.7rem; font-weight: 600; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; }

    /* Kanban */
    .kanban-board { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; align-items: start; }
    .kanban-col { background: var(--mat-sys-surface-container-low); border-radius: var(--mat-sys-corner-large); padding: 16px; h4 { margin: 0 0 16px; font-size: 0.85rem; color: var(--mat-sys-on-surface-variant); text-transform: uppercase; } }
    .kanban-card { padding: 16px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 12px; p { margin: 0; font-size: 0.9rem; line-height: 1.4; } }
    .kanban-card .badge { align-self: flex-start; &.warning { background: var(--mat-sys-warning-container); color: var(--mat-sys-on-warning-container); } &.info { background: var(--mat-sys-info-container); color: var(--mat-sys-on-info-container); } &.success { background: var(--mat-sys-success-container); color: var(--mat-sys-on-success-container); } }

    /* Mobile Frame */
    .mobile-frame-wrapper { display: flex; justify-content: center; }
    .mobile-device { width: 375px; height: 667px; border: 8px solid #222; border-radius: 36px; overflow: hidden; display: flex; flex-direction: column; background: var(--mat-sys-background); position: relative; box-shadow: 0 24px 48px rgba(0,0,0,0.2); }
    .mobile-content { flex: 1; padding: 0; overflow-y: auto; }
    .mock-list-item { display: flex; gap: 16px; padding: 16px; align-items: center; }
    .avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
    .text { line-height: 1.4; strong { color: var(--mat-sys-on-background); font-size: 0.95rem; } small { color: var(--mat-sys-on-surface-variant); font-size: 0.85rem; } }
    .mobile-fab { position: absolute; bottom: 80px; right: 16px; }
    .mock-bottom-nav { height: 64px; background: var(--mat-sys-surface-container); border-top: 1px solid var(--mat-sys-outline-variant); display: flex; justify-content: space-around; align-items: center; mat-icon { color: var(--mat-sys-on-surface-variant); } mat-icon[color="primary"] { color: var(--mat-sys-primary); } }
  `]
})
export class LayoutsViewComponent implements AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['name', 'role', 'status'];
  dataSource = [
    { name: 'Arthur J.', role: 'Principal Architect', status: 'Active', statusColor: 'success' },
    { name: 'Sarah M.', role: 'Designer', status: 'Review', statusColor: 'warning' },
    { name: 'John D.', role: 'Developer', status: 'Offline', statusColor: 'error' },
  ];

  @ViewChildren('spyTarget') spyTargets!: QueryList<ElementRef<HTMLElement>>;
  @Output() sectionScrolled = new EventEmitter<string>();
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit() {
    this.observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting);
      if (visible.length > 0) this.sectionScrolled.emit(visible[0].target.id);
    }, { rootMargin: '-10% 0px -70% 0px' });
    this.spyTargets.forEach(target => this.observer?.observe(target.nativeElement));
  }

  ngOnDestroy() { this.observer?.disconnect(); }
}