import type { NavigationProp, RouteProp } from '@react-navigation/native';

import type { FC } from 'react';

import NavigationTabs from '@/navigation/NavigationTabs';
import { useAppSelector } from '@/store';
import DebugScreen from '@/views/DebugScreen';
import ManuallyEnterTableScreen from '@/views/ManuallyEnterTableScreen';
import ScanTableQrCodeScreen from '@/views/ScanTableQrCodeScreen';
import SettingsScreen from '@/views/SettingsScreen';
import StartScreen from '@/views/StartScreen';
import StartSessionScreen from '@/views/StartSessionScreen';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const screenNames = [
    'StartScreen',
    'ScanTableQrCodeScreen',
    'ManuallyEnterTableScreen',
    'StartSessionScreen',
    'OrderTabs',
    'SettingsScreen',
    'DebugScreen',
] as const;

type ScreenName = (typeof screenNames)[number];

export type ParamListWithScreenNames = Record<ScreenName, object | undefined>;

export type PropsWithNavigation = {
    navigation: NavigationProp<ParamListWithScreenNames>;
    route: RouteProp<ParamListWithScreenNames>;
};

const Stack = createNativeStackNavigator();

declare global {
    namespace ReactNavigation {
        interface RootParamList extends ParamListWithScreenNames {}
    }
}

const NavigationStack: FC = () => {
    const hasCurrentSession = useAppSelector(
        state => state.persisted.currentSession !== null,
    );

    return (
        <Stack.Navigator
            initialRouteName={hasCurrentSession ? 'OrderTabs' : 'StartScreen'}
            screenOptions={{
                headerShown: false,
                headerBackVisible: false,
                headerTitle: '',
                headerTransparent: true,
            }}
        >
            <Stack.Screen
                name="StartScreen"
                component={StartScreen}
                options={{ orientation: 'portrait' }}
            />
            <Stack.Screen
                name="ScanTableQrCodeScreen"
                component={ScanTableQrCodeScreen}
                options={{ orientation: 'portrait' }}
            />
            <Stack.Screen
                name="ManuallyEnterTableScreen"
                component={ManuallyEnterTableScreen}
                options={{ orientation: 'portrait' }}
            />
            <Stack.Screen name="OrderTabs" component={NavigationTabs} />
            <Stack.Screen
                name="StartSessionScreen"
                component={StartSessionScreen}
            />
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
            <Stack.Screen name="DebugScreen" component={DebugScreen} />
        </Stack.Navigator>
    );
};

export default NavigationStack;
