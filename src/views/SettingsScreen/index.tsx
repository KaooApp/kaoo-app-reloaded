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
} from '@/slices/settings';
import { useAppDispatch, useAppSelector } from '@/store';

import { useNavigation } from '@react-navigation/native';

const SettingsScreen: FC = () => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const navigation = useNavigation();

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
        <AppBarLayout title="Settings" back>
            <ScrollView>
                <SettingsSection title="Theme">
                    <SettingsItem title={false}>
                        {Object.values(AppColorScheme).map(
                            (scheme, index, { length }) => (
                                <View key={scheme}>
                                    <TouchableRipple
                                        onPress={() => setAppScheme(scheme)}
                                        borderless
                                        style={{
                                            borderTopRightRadius: 16,
                                            borderTopLeftRadius: 16,
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
                                                {scheme}
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
                <SettingsSection title="Session">
                    <SettingsItem
                        title="Set person count"
                        onPress={() => setPersonModalOpen(true)}
                    >
                        <Icon source="chevron-right" size={24} />
                    </SettingsItem>
                    <SettingsItem
                        title="Manage session"
                        subtitle="Hint: This will not save anything from the current session"
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
                            End session
                        </Button>
                    </SettingsItem>
                </SettingsSection>
                <SettingsSection title="Restaurant">
                    <SettingsItem title={false}>
                        <Box p={12}>
                            <Box mb={8}>
                                <TextInput
                                    label="Shop ID"
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
                                    Hint: This cannot be changed during an
                                    active session
                                </Text>
                            ) : null}
                        </Box>
                    </SettingsItem>
                </SettingsSection>
                {debuggingEnabled ? (
                    <SettingsSection title="Debugging">
                        <SettingsItem title="Debug screen">
                            <Button
                                onPress={() => {
                                    navigation.navigate('DebugScreen');
                                }}
                                mode="contained-tonal"
                            >
                                Open
                            </Button>
                        </SettingsItem>
                        <SettingsItem title="Disable debugging">
                            <Button
                                onPress={() => {
                                    dispatch(disableDebugging());
                                    setPresses(0);
                                }}
                                mode="contained"
                                buttonColor={theme.colors.error}
                                textColor={theme.colors.onError}
                            >
                                Disable
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
                    App Version {packageJson.version}
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
