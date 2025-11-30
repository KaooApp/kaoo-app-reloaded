import type { NavigationProp, RouteProp } from '@react-navigation/native';

import type { FC } from 'react';

import { useAppSelector } from '@/store';
import OrderScreens from '@/views/OrderScreens';
import SettingsScreen from '@/views/SettingsScreen';
import StartSessionScreen from '@/views/StartSessionScreen';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const screenNames = [
    'OrderScreens',
    'StartSessionScreen',
    'SettingsScreen',
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
            initialRouteName={
                hasCurrentSession ? 'OrderScreens' : 'StartSessionScreen'
            }
            screenOptions={{
                headerShown: false,
                headerBackVisible: false,
                headerTitle: '',
                headerTransparent: true,
            }}
        >
            <Stack.Screen name="OrderScreens" component={OrderScreens} />
            <Stack.Screen
                name="StartSessionScreen"
                component={StartSessionScreen}
            />
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        </Stack.Navigator>
    );
};

export default NavigationStack;
