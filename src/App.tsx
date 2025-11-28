import type { FC } from 'react';
import { StrictMode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';

import { PersistGate as ReduxPersistGate } from 'redux-persist/integration/react';

import InnerApp from '@/components/InnerApp';
import { persistor, store } from '@/store';

const App: FC = () => (
    <StrictMode>
        <SafeAreaProvider>
            <ReduxProvider store={store}>
                <ReduxPersistGate persistor={persistor} loading={null}>
                    <InnerApp />
                </ReduxPersistGate>
            </ReduxProvider>
        </SafeAreaProvider>
    </StrictMode>
);

export default App;
