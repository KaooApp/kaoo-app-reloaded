/* eslint-disable @typescript-eslint/no-use-before-define */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import type { FC } from 'react';
import { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { PaperProvider } from 'react-native-paper';
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { NewAppScreen } from '@react-native/new-app-screen';

const App: FC = () => {
    const isDarkMode = useColorScheme() === 'dark';

    useEffect(() => {
        BootSplash.hide({ fade: true });
    }, []);

    return (
        <PaperProvider>
            <SafeAreaProvider>
                <StatusBar
                    barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                />
                <AppContent />
            </SafeAreaProvider>
        </PaperProvider>
    );
};

const AppContent: FC = () => {
    const safeAreaInsets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <NewAppScreen
                templateFileName="App.tsx"
                safeAreaInsets={safeAreaInsets}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default App;
