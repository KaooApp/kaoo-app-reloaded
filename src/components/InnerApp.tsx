import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';
import BootSplash from 'react-native-bootsplash';
// import Config from 'react-native-config';
import { Icon, PaperProvider } from 'react-native-paper';
import Toast, {
    BaseToast,
    ErrorToast,
    InfoToast,
    SuccessToast,
} from 'react-native-toast-message';

import moment from 'moment';

import rootLogging from '@/utils/root-logging';
import {
    darkTheme,
    lightTheme,
    ReactNavigationDarkTheme,
    ReactNavigationLightTheme,
} from '@/utils/theme';

import NavigationStack from '@/navigation/NavigationStack';
import { setLanguage } from '@/slices/settings';
import { useAppDispatch, useAppSelector } from '@/store';
import type { SupportedLanguage } from '@/translations';

import RNLanguageDetector from '@os-team/i18next-react-native-language-detector';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { NavigationContainer } from '@react-navigation/native';
import { NavigationBar } from '@zoontek/react-native-navigation-bar';

const log = rootLogging.extend('InnerApp');

const InnerApp: FC = () => {
    const { i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const colorScheme = useColorScheme();
    const { theme: m3theme } = useMaterial3Theme();

    const colorSchemeSetting = useAppSelector(
        state => state.settings.colorScheme,
    );
    const enableDeviceColors = useAppSelector(
        state => state.settings.enableDeviceColors,
    );

    const systemSchemeIsDark = colorScheme === 'dark';

    const enableDarkMode = useMemo(() => {
        if (colorSchemeSetting === 'system') {
            log.debug('systemSchemeIsDark', systemSchemeIsDark);
            return systemSchemeIsDark;
        }

        log.debug('appTheme === dark', colorSchemeSetting === 'dark');
        return colorSchemeSetting === 'dark';
    }, [colorSchemeSetting, systemSchemeIsDark]);

    const theme = useMemo(() => {
        if (enableDarkMode) {
            log.debug('enableDarkMode');

            if (enableDeviceColors) {
                return { ...darkTheme, colors: m3theme.dark };
            }
            return darkTheme;
        }

        log.debug('lightMode');

        if (enableDeviceColors) {
            return { ...lightTheme, colors: m3theme.light };
        }
        return lightTheme;
    }, [enableDarkMode, enableDeviceColors, m3theme.dark, m3theme.light]);

    const navigationTheme = useMemo(() => {
        if (enableDarkMode) return ReactNavigationDarkTheme;
        return ReactNavigationLightTheme;
    }, [enableDarkMode]);

    const language = useAppSelector(state => state.settings.language);

    const [i18nLanguageMatchesSettings, setI18nLanguageMatchesSettings] =
        useState<boolean>(false);

    useEffect(() => {
        i18n.on('languageChanged', () => {
            setI18nLanguageMatchesSettings(true);
            BootSplash.hide();
        });

        return () => {
            i18n.off('languageChanged');
        };
    }, [i18n]);

    useEffect(() => {
        if (language === null) {
            const res = RNLanguageDetector.detect();
            log.debug('RNLanguageDetector.detect()', res);

            let tmpLanguage = 'en';

            if (Array.isArray(res)) {
                tmpLanguage = res[0].language;
            }

            log.debug('language', tmpLanguage);

            setI18nLanguageMatchesSettings(false);
            dispatch(
                setLanguage({ language: tmpLanguage as SupportedLanguage }),
            );
            i18n.changeLanguage(tmpLanguage);
        }
    }, [i18n, language, dispatch]);

    useEffect(() => {
        if (language === null) {
            log.warn('language === null');
            return;
        }

        setI18nLanguageMatchesSettings(false);
        i18n.changeLanguage(language);

        let momentLocale: string;

        switch (language) {
            case 'en':
                momentLocale = 'en-gb';
                break;
            default:
                momentLocale = language;
                break;
        }

        if (moment.locales().includes(momentLocale)) {
            moment.locale(momentLocale);
        } else {
            log.error(`moment locale "${momentLocale}" not available`);
            moment.locale('en-gb');
        }
    }, [i18n, language]);

    /* useEffect(() => {
        log.info('react-native-config', JSON.stringify(Config, null, 4));
    }, []); */

    if (!i18nLanguageMatchesSettings) {
        return null;
    }

    return (
        <PaperProvider theme={theme}>
            <NavigationBar
                barStyle={enableDarkMode ? 'dark-content' : 'light-content'}
            />
            <NavigationContainer theme={navigationTheme}>
                <NavigationStack />
                <Toast
                    position="bottom"
                    config={{
                        success: props => (
                            <SuccessToast
                                {...props}
                                contentContainerStyle={{
                                    backgroundColor:
                                        theme.colors.elevation.level2,
                                }}
                                text1Style={{ color: theme.colors.onSurface }}
                                text2Style={{ color: theme.colors.onSurface }}
                            />
                        ),
                        error: props => (
                            <ErrorToast
                                {...props}
                                contentContainerStyle={{
                                    backgroundColor:
                                        theme.colors.elevation.level2,
                                }}
                                text1Style={{ color: theme.colors.onSurface }}
                                text2Style={{ color: theme.colors.onSurface }}
                            />
                        ),
                        info: props => (
                            <InfoToast
                                {...props}
                                contentContainerStyle={{
                                    backgroundColor:
                                        theme.colors.elevation.level2,
                                }}
                                text1Style={{ color: theme.colors.onSurface }}
                                text2Style={{ color: theme.colors.onSurface }}
                            />
                        ),
                        warning: props => (
                            <BaseToast
                                {...props}
                                style={{ borderLeftColor: '#FFC107' }}
                                contentContainerStyle={{
                                    backgroundColor:
                                        theme.colors.elevation.level2,
                                }}
                                text1Style={{ color: theme.colors.onSurface }}
                                text2Style={{ color: theme.colors.onSurface }}
                            />
                        ),
                    }}
                />
            </NavigationContainer>
        </PaperProvider>
    );
};

export default InnerApp;
