/*
 * Public API Surface of ng-material-preferences
 */

// 1. The Main Facade (What consumers use in their components)
export * from './lib/services/preferences.service';

// 2. Setup & Configuration (What consumers use in app.config.ts)
export * from './lib/services/preferences/preferences.providers';
export * from './lib/services/preferences/font-loader.strategy';

// 3. Storage Abstractions (For consumers who want to sync with a Database)
export * from './lib/storage/preferences-storage.interface';
export * from './lib/storage/local-preferences-storage.service';

// 4. Types & Constants (For type-safety in consumer apps)
export * from './lib/models/preferences.types';
export * from './lib/models/preferences.constants';