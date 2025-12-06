import { ScrollView, View } from 'react-native';
import { useEffect, useState } from 'react';

import { Box, Flex } from 'react-native-flex-layout';
import {
    Button,
    Divider,
    Icon,
    RadioButton,
    Text,
    TextInput,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import packageJson from 'package.json';
import { useDebounce } from 'use-debounce';

import type { ShopId } from '@/types/restaurant';
import { AppColorScheme } from '@/types/settings';

import AppBarLayout from '@/components/layout/AppBarLayout';
import PersonModal from '@/components/modals/PersonModal';
import SettingsItem from '@/components/settings/SettingsItem';
import SettingsSection from '@/components/settings/SettingsSection';
import { clearSessionWithoutSave, selectStore } from '@/slices/persisted';
import {
    disableDebugging,
    enableDebugging,
    setColorScheme,
    setLanguage,
} from '@/slices/settings';
import { useAppDispatch, useAppSelector } from '@/store';
import type { SupportedLanguage } from '@/translations';
import { supportedLanguages } from '@/translations';

import { useNavigation } from '@react-navigation/native';

const SettingsScreen: FC = () => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const navigation = useNavigation();
    const { t } = useTranslation();

    const debuggingEnabled = useAppSelector(state => state.settings.debugging);
    const [presses, setPresses] = useState<number | null>(
        debuggingEnabled ? null : 0,
    );

    const settings = useAppSelector(state => state.settings);
    const selectedRestaurantId = useAppSelector(
        state => state.persisted.selectedStore.id,
    );

    const hasActiveSession = useAppSelector(
        state => state.persisted.currentSession !== null,
    );

    const setAppScheme = (scheme: AppColorScheme): void => {
        dispatch(setColorScheme({ scheme }));
    };

    const setAppLanguage = (language: SupportedLanguage): void => {
        dispatch(setLanguage({ language }));
    };

    const [shopIdText, setShopIdText] = useState<string>(selectedRestaurantId);
    const [debouncedShopId] = useDebounce(shopIdText, 300, {
        leading: false,
        trailing: true,
    });

    useEffect(() => {
        if (debouncedShopId) {
            dispatch(selectStore({ shopId: debouncedShopId as ShopId }));
        }
    }, [debouncedShopId, dispatch]);

    const [personModalOpen, setPersonModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if (debuggingEnabled) {
            return;
        }

        if (presses && presses > 5) {
            dispatch(enableDebugging());
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPresses(null);
            Toast.show({
                text1: 'Debugging enabled',
                type: 'info',
            });
        }
    }, [debuggingEnabled, dispatch, presses]);

    return (
        <AppBarLayout title={t('views.settingsScreen.title')} back>
            <ScrollView>
                <SettingsSection title={t('views.settingsScreen.theme')}>
                    <SettingsItem title={false}>
                        {Object.values(AppColorScheme).map(
                            (scheme, index, { length }) => (
                                <View key={`scheme-${scheme}`}>
                                    <TouchableRipple
                                        onPress={() => setAppScheme(scheme)}
                                        borderless
                                        style={{
                                            ...(index === 0
                                                ? {
                                                      borderTopRightRadius: 16,
                                                      borderTopLeftRadius: 16,
                                                  }
                                                : {}),
                                            ...(index === length - 1 ||
                                            length === 1
                                                ? {
                                                      borderBottomRightRadius: 16,
                                                      borderBottomLeftRadius: 16,
                                                  }
                                                : {}),
                                        }}
                                    >
                                        <Flex
                                            fill
                                            inline
                                            items="center"
                                            justify="between"
                                            style={{
                                                gap: 8,
                                                paddingHorizontal: 12,
                                                paddingVertical: 4,
                                            }}
                                        >
                                            <Text variant="bodyLarge">
                                                {t(
                                                    `views.settingsScreen.themeValue.${scheme}`,
                                                )}
                                            </Text>
                                            <RadioButton
                                                value="light"
                                                status={
                                                    settings.colorScheme ===
                                                    scheme
                                                        ? 'checked'
                                                        : 'unchecked'
                                                }
                                            />
                                        </Flex>
                                    </TouchableRipple>
                                    {index < length - 1 ? <Divider /> : null}
                                </View>
                            ),
                        )}
                    </SettingsItem>
                </SettingsSection>
                <SettingsSection title={t('views.settingsScreen.language')}>
                    <SettingsItem title={false}>
                        {supportedLanguages.map(
                            (language, index, { length }) => (
                                <View key={`language-${language}`}>
                                    <TouchableRipple
                                        onPress={() => setAppLanguage(language)}
                                        borderless
                                        style={{
                                            ...(index === 0
                                                ? {
                                                      borderTopRightRadius: 16,
                                                      borderTopLeftRadius: 16,
                                                  }
                                                : {}),
                                            ...(index === length - 1 ||
                                            length === 1
                                                ? {
                                                      borderBottomRightRadius: 16,
                                                      borderBottomLeftRadius: 16,
                                                  }
                                                : {}),
                                        }}
                                    >
                                        <Flex
                                            fill
                                            inline
                                            items="center"
                                            justify="between"
                                            style={{
                                                gap: 8,
                                                paddingHorizontal: 12,
                                                paddingVertical: 4,
                                            }}
                                        >
                                            <Text variant="bodyLarge">
                                                {t(`language`, {
                                                    lng: language,
                                                })}
                                            </Text>
                                            <RadioButton
                                                value="light"
                                                status={
                                                    settings.language ===
                                                    language
                                                        ? 'checked'
                                                        : 'unchecked'
                                                }
                                            />
                                        </Flex>
                                    </TouchableRipple>
                                    {index < length - 1 ? <Divider /> : null}
                                </View>
                            ),
                        )}
                    </SettingsItem>
                </SettingsSection>
                <SettingsSection title={t('views.settingsScreen.session')}>
                    <SettingsItem
                        title={t('views.settingsScreen.setPersonCount')}
                        onPress={() => setPersonModalOpen(true)}
                    >
                        <Icon source="chevron-right" size={24} />
                    </SettingsItem>
                    <SettingsItem
                        title={t('views.settingsScreen.manageSession')}
                        subtitle={t('views.settingsScreen.endSessionHint')}
                        color={theme.colors.error}
                    >
                        <Button
                            mode="contained"
                            onPress={() => {
                                dispatch(clearSessionWithoutSave());
                            }}
                            buttonColor={theme.colors.errorContainer}
                            textColor={theme.colors.onErrorContainer}
                            disabled={!hasActiveSession}
                        >
                            {t('views.settingsScreen.endSession')}
                        </Button>
                    </SettingsItem>
                </SettingsSection>
                <SettingsSection title={t('views.settingsScreen.restaurant')}>
                    <SettingsItem title={false}>
                        <Box p={12}>
                            <Box mb={8}>
                                <TextInput
                                    label={t('views.settingsScreen.shopId')}
                                    style={{
                                        borderTopLeftRadius: 12,
                                        borderTopRightRadius: 12,
                                    }}
                                    value={shopIdText}
                                    onChangeText={text => setShopIdText(text)}
                                    disabled={hasActiveSession}
                                />
                            </Box>
                            {hasActiveSession ? (
                                <Text variant="labelSmall">
                                    {t(
                                        'views.settingsScreen.activeSessionHint',
                                    )}
                                </Text>
                            ) : null}
                        </Box>
                    </SettingsItem>
                </SettingsSection>
                {debuggingEnabled ? (
                    <SettingsSection
                        title={t('views.settingsScreen.debugging')}
                    >
                        <SettingsItem
                            title={t('views.settingsScreen.debugScreen')}
                        >
                            <Button
                                onPress={() => {
                                    navigation.navigate('DebugScreen');
                                }}
                                mode="contained-tonal"
                            >
                                {t('generic.open')}
                            </Button>
                        </SettingsItem>
                        <SettingsItem
                            title={t('views.settingsScreen.disableDebugging')}
                        >
                            <Button
                                onPress={() => {
                                    dispatch(disableDebugging());
                                    setPresses(0);
                                }}
                                mode="contained"
                                buttonColor={theme.colors.error}
                                textColor={theme.colors.onError}
                            >
                                {t('generic.disable')}
                            </Button>
                        </SettingsItem>
                    </SettingsSection>
                ) : null}
            </ScrollView>
            <Flex inline center mv={8}>
                <Text
                    variant="labelSmall"
                    onPress={() => {
                        if (debuggingEnabled) {
                            return;
                        }

                        setPresses(prevState => {
                            if (prevState === null) {
                                return null;
                            }

                            return prevState + 1;
                        });
                    }}
                >
                    {t('views.settingsScreen.appVersion', {
                        version: packageJson.version,
                    })}
                </Text>
            </Flex>
            <PersonModal
                open={personModalOpen}
                onClose={() => setPersonModalOpen(false)}
            />
        </AppBarLayout>
    );
};

export default SettingsScreen;
