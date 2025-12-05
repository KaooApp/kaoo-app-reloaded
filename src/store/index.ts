import type { Storage } from 'redux-persist';

import { MMKV } from 'react-native-mmkv';
import type { TypedUseSelectorHook } from 'react-redux';
import {
    useDispatch as useReduxDispatch,
    useSelector as useReduxSelector,
} from 'react-redux';

import { persistReducer, persistStore } from 'redux-persist';

import { LoggingReducer } from '@/slices/logging';
import { PersistedReducer } from '@/slices/persisted';
import { SettingsReducer } from '@/slices/settings';
import { UiReducer } from '@/slices/ui';

import { combineReducers, configureStore } from '@reduxjs/toolkit';

const storage = new MMKV();

const reduxStorage: Storage = {
    setItem: (key, value) => {
        storage.set(key, value);
        return Promise.resolve(true);
    },
    getItem: key => {
        const value = storage.getString(key);
        return Promise.resolve(value);
    },
    removeItem: key => {
        storage.delete(key);
        return Promise.resolve();
    },
};

const settingsPersistConfig = {
    key: 'root',
    storage: reduxStorage,
    debug: __DEV__,
    version: 1,
};

const persistedStateConfig = {
    key: 'persistState',
    storage: reduxStorage,
    debug: __DEV__,
    version: 1,
};

const rootReducer = combineReducers({
    settings: persistReducer(settingsPersistConfig, SettingsReducer),
    persisted: persistReducer(persistedStateConfig, PersistedReducer),
    ui: UiReducer,
    logging: LoggingReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        }),
    devTools: __DEV__,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useAppDispatch = () => useReduxDispatch<AppDispatch>();
