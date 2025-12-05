/* eslint-disable @typescript-eslint/no-unused-vars,no-param-reassign */
import type {
    SetColorSchemeAction,
    SetLanguageAction,
    SettingsState,
} from '@/types/settings';
import { AppColorScheme } from '@/types/settings';

// import { rootLogging } from '@/utils/root-logging';
import { createSlice } from '@reduxjs/toolkit';

const initialState: SettingsState = {
    colorScheme: AppColorScheme.System,
    language: null,
    debugging: false,
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
        setLanguage: (state, action: SetLanguageAction) => {
            state.language = action.payload.language;
        },
        enableDebugging: state => {
            state.debugging = true;
        },
        disableDebugging: state => {
            state.debugging = false;
        },
    },
});

export const {
    resetSettings,
    setColorScheme,
    setLanguage,
    enableDebugging,
    disableDebugging,
} = settingsSlice.actions;

export const { reducer: SettingsReducer } = settingsSlice;

export default settingsSlice.reducer;
