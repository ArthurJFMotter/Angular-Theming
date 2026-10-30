import { Component, signal, computed, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { BottomSheetData } from '../../../../../core/models/bottom-sheet.model';
import { BottomSheetService } from '../../../../../core/services/bottom-sheet.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { DynamicBottomSheetComponent } from '../../../../../shared/components/dynamic-bottom-sheet/dynamic-bottom-sheet.component';

@Component({
  selector: 'app-mobile-frame-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    DynamicBottomSheetComponent,
  ],
  templateUrl: './mobile-frame-layout.component.html',
  styleUrl: './mobile-frame-layout.component.scss',
})
export class MobileFrameLayoutComponent implements OnDestroy {
  private readonly bottomSheet = inject(BottomSheetService);
  private readonly notify = inject(NotificationService, { optional: true });
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly sheetOpen = signal(false);
  readonly isHorizontal = signal(false);
  readonly isRotating = signal(false);
  private rotateTimer?: ReturnType<typeof setTimeout>;

  private readonly bp = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(map((r) => r.matches)),
    { initialValue: false }
  );

  readonly isRealMobile = computed(() => this.bp());

  // Configuration for the dynamic bottom sheet
  readonly composeSheetData: BottomSheetData = {
    title: 'Compose',
    showCloseButton: false,
    items: [
      { label: 'New Email', icon: 'mail', value: 'email' },
      { label: 'New Group Chat', icon: 'group', value: 'group' },
      { label: 'Schedule Send', icon: 'schedule', value: 'schedule' },
    ],
  };

  handleSheetAction(choice: any): void {
    this.sheetOpen.set(false);
    if (choice && this.notify) {
      const labels: Record<string, string> = {
        email: 'New Email',
        group: 'New Group Chat',
        schedule: 'Schedule Send',
      };
      this.notify.show('info', `Selected: ${labels[choice] ?? choice}`);
    }
  }

  // Triggered on actual mobile devices
  openRealMobileSheet(): void {
    this.bottomSheet
      .open(this.composeSheetData)
      .subscribe((choice) => this.handleSheetAction(choice));
  }

  toggleOrientation(): void {
    if (this.isRotating()) return;
    this.sheetOpen.set(false);
    this.isRotating.set(true);

    const scale =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--theme-motion-scale'
        ) || '1'
      ) || 1;

    const duration = 600 * scale;

    this.rotateTimer = setTimeout(() => {
      this.isHorizontal.update((v) => !v);
      this.isRotating.set(false);
    }, duration);
  }

  ngOnDestroy(): void {
    if (this.rotateTimer) clearTimeout(this.rotateTimer);
  }
}