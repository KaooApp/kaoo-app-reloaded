import { StrictMode } from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { FC } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import { PersistGate as ReduxPersistGate } from 'redux-persist/integration/react';

import ApiFetcher from '@/components/general/ApiFetcher';
import InnerApp from '@/components/general/InnerApp';
import { persistor, store } from '@/store';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const App: FC = () => (
    <StrictMode>
        <SafeAreaProvider>
            <ReduxProvider store={store}>
                <ReduxPersistGate persistor={persistor} loading={null}>
                    <ApiFetcher>
                        <GestureHandlerRootView>
                            <BottomSheetModalProvider>
                                <InnerApp />
                            </BottomSheetModalProvider>
                        </GestureHandlerRootView>
                    </ApiFetcher>
                </ReduxPersistGate>
            </ReduxProvider>
        </SafeAreaProvider>
    </StrictMode>
);

export default App;
