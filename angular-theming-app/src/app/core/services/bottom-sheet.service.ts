import { Injectable, inject } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetConfig,
} from '@angular/material/bottom-sheet';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DynamicBottomSheetComponent } from '../../shared/components/dynamic-bottom-sheet/dynamic-bottom-sheet.component';
import { BottomSheetData, BottomSheetItem } from '../models/bottom-sheet.model';

@Injectable({ providedIn: 'root' })
export class BottomSheetService {
  private readonly bottomSheet = inject(MatBottomSheet);

  // =========================================================
  // DYNAMIC BOTTOM SHEET ENGINE
  // =========================================================

  /**
   * Spawns a data-driven dynamic bottom sheet.
   * @param data Content, forms, or action items to render
   * @param config Optional MatBottomSheetConfig (panelClass, hasBackdrop, etc.)
   */
  open<T = any>(
    data: BottomSheetData,
    config?: MatBottomSheetConfig
  ): Observable<T | undefined> {
    const sheetRef = this.bottomSheet.open(DynamicBottomSheetComponent, {
      data,
      ...config,
    });

    return sheetRef.afterDismissed();
  }

  /**
   * Shortcut for an M3 Action List picker sheet.
   */
  actionSheet<T = any>(
    title: string,
    items: BottomSheetItem[],
    subtitle?: string,
    config?: MatBottomSheetConfig
  ): Observable<T | undefined> {
    return this.open<T>(
      {
        title,
        subtitle,
        items,
        showCloseButton: true,
      },
      config
    );
  }

  /**
   * Shortcut for a confirmation bottom sheet.
   */
  confirm(
    title: string,
    message: string,
    icon: string = 'help_outline',
    config?: MatBottomSheetConfig
  ): Observable<boolean> {
    return this.open<boolean>(
      {
        title,
        message,
        icon,
        showCloseButton: false,
        actions: [
          { label: 'Cancel', value: false },
          { label: 'Confirm', value: true, isPrimary: true, color: 'primary' },
        ],
      },
      config
    ).pipe(map((res) => !!res));
  }

  // =========================================================
  // APPLICATION SPECIFIC SHEETS
  // =========================================================
}