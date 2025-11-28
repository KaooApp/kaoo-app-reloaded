/* eslint-disable @typescript-eslint/no-unused-vars,no-param-reassign */
import { Platform } from 'react-native';

import type {
    SetColorSchemeAction,
    SetEnableDeviceColorsAction,
    SetLanguageAction,
    SettingsState,
} from '@/types/settings';
import { AppColorScheme } from '@/types/settings';

// import { rootLogging } from '@/utils/root-logging';
import { createSlice } from '@reduxjs/toolkit';

const initialState: SettingsState = {
    colorScheme: AppColorScheme.System,
    enableDeviceColors: Platform.OS === 'android',
    language: null,
};

// const log = rootLogging.extend('SettingsSlice');

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        resetSettings: state => {
            state = initialState;
        },
        setColorScheme: (state, action: SetColorSchemeAction) => {
            state.colorScheme = action.payload.scheme;
        },
        setEnableDeviceColors: (state, action: SetEnableDeviceColorsAction) => {
            state.enableDeviceColors = action.payload.enable;
        },
        setLanguage: (state, action: SetLanguageAction) => {
            state.language = action.payload.language;
        },
    },
});

export const {
    resetSettings,
    setColorScheme,
    setEnableDeviceColors,
    setLanguage,
} = settingsSlice.actions;

export const { reducer: SettingsReducer } = settingsSlice;

export default settingsSlice.reducer;
