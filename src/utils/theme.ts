import type { MD3Theme } from 'react-native-paper';
import {
    adaptNavigationTheme,
    MD3DarkTheme,
    MD3LightTheme,
} from 'react-native-paper';

import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

// == react-native-paper == //
export const lightTheme: MD3Theme = {
    ...MD3LightTheme,
};

export const darkTheme: MD3Theme = {
    ...MD3DarkTheme,
};

// == React Navigation == //
const reactNavigationDarkTheme = {
    ...NavigationDarkTheme,
};

const reactNavigationLightTheme = {
    ...NavigationDefaultTheme,
};

export const {
    LightTheme: ReactNavigationLightTheme,
    DarkTheme: ReactNavigationDarkTheme,
} = adaptNavigationTheme({
    reactNavigationLight: reactNavigationLightTheme,
    reactNavigationDark: reactNavigationDarkTheme,
});
