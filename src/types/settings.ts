import type { PayloadAction } from '@reduxjs/toolkit';

import type { SupportedLanguage } from '@/translations';

export enum AppColorScheme {
    Light = 'light',
    Dark = 'dark',
    System = 'system',
}

export declare type DefaultLanguage = null;

export interface SettingsState {
    colorScheme: AppColorScheme;
    enableDeviceColors: boolean;
    language: SupportedLanguage | DefaultLanguage;
}

export type SetColorSchemeAction = PayloadAction<{
    scheme: SettingsState['colorScheme'];
}>;

export type SetEnableDeviceColorsAction = PayloadAction<{
    enable: boolean;
}>;

export type SetLanguageAction = PayloadAction<{
    language: SupportedLanguage;
}>;
