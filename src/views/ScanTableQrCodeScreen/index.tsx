import { Platform } from 'react-native';
import { useCallback, useEffect, useState } from 'react';

import { Flex } from 'react-native-flex-layout';
import { Button, Icon, Text } from 'react-native-paper';
import {
    check as rnCheckPermissions,
    openSettings,
    PERMISSIONS,
} from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { convertBarcodeToTableNumber } from '@/utils/helpers';
import rootLogging from '@/utils/root-logging';

import AppBarLayout from '@/components/layout/AppBarLayout';
import FlexWithMargin from '@/components/layout/FlexWithMargin';
import { startRestaurantSession } from '@/slices/persisted';
import { useAppDispatch } from '@/store';

import BarcodeScanner, {
    CameraView,
} from '@pushpendersingh/react-native-scanner';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const log = rootLogging.extend('ScanTableQrCodeScreen');

const ScanTableQrCodeScreen: FC = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const { t } = useTranslation();

    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanning, setScanning] = useState<boolean>(false);
    const [flashState, setFlashState] = useState<boolean>(false);

    const goBack = (): void => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    const startScanning = useCallback(async (): Promise<void> => {
        log.info('Start scanning...');

        if (scanning) {
            log.warn('Already scanning, aborting...');
            return;
        }

        // Check permission before scanning
        const granted = await BarcodeScanner.hasCameraPermission();

        if (!granted) {
            return;
        }

        setScanning(true);

        await BarcodeScanner.startScanning(async barcodes => {
            const tableNumber = barcodes
                .map(barcode => convertBarcodeToTableNumber(barcode))
                .filter(Boolean)
                .at(0);

            await BarcodeScanner.stopScanning();
            setScanning(false);
            await BarcodeScanner.releaseCamera();

            if (tableNumber) {
                dispatch(startRestaurantSession({ info: { tableNumber } }));
                navigation.navigate('StartSessionScreen');
            } else {
                Toast.show({
                    text1: t('views.scanTableQrCodeScreen.invalidTable'),
                    type: 'error',
                });
            }
        });
    }, [scanning, dispatch, navigation, t]);

    const checkPermission = useCallback(async (): Promise<boolean> => {
        const granted = await BarcodeScanner.hasCameraPermission();
        setHasPermission(granted);

        return granted;
    }, []);

    const requestPermission = useCallback(async (): Promise<boolean> => {
        const granted = await BarcodeScanner.requestCameraPermission();
        setHasPermission(granted);

        if (granted) {
            Toast.show({
                text1: t('generic.success'),
                text2: t('views.scanTableQrCodeScreen.permissionGranted'),
                type: 'success',
            });
            return true;
        }

        const permission = Platform.select({
            ios: PERMISSIONS.IOS.CAMERA,
            android: PERMISSIONS.ANDROID.CAMERA,
        });

        const cameraPermissionStatus = await rnCheckPermissions(permission!);

        const permissionBlocked =
            cameraPermissionStatus === 'blocked' ||
            cameraPermissionStatus === 'denied';

        if (permissionBlocked) {
            await openSettings('application');
        }

        Toast.show({
            text1: t('views.scanTableQrCodeScreen.permissionDenied'),
            text2: t('views.scanTableQrCodeScreen.permissionInfo'),
            type: 'error',
        });

        return false;
    }, [t]);

    useFocusEffect(() => {
        if (scanning) {
            return;
        }

        checkPermission().then(granted => {
            if (!granted) {
                requestPermission().then(success => {
                    if (success) {
                        startScanning();
                    }
                });
            } else {
                startScanning();
            }
        });
    });

    useEffect(() => {
        const func = async (state: boolean): Promise<void> => {
            if (state) {
                await BarcodeScanner.enableFlashlight();
            } else {
                await BarcodeScanner.disableFlashlight();
            }
        };

        func(flashState);
    }, [flashState]);

    return (
        <AppBarLayout back settings>
            {hasPermission === null ? (
                <FlexWithMargin fill center>
                    <Text variant="headlineMedium">
                        {t('views.scanTableQrCodeScreen.checkingPermissions')}
                    </Text>
                </FlexWithMargin>
            ) : hasPermission ? (
                <Flex fill style={{ gap: 16 }} mb={16}>
                    <CameraView style={{ flex: 1 }} />
                    <Flex inline mb={16} mh={32}>
                        <Button
                            onPress={() =>
                                setFlashState(prevState => !prevState)
                            }
                            style={{ flex: 1 }}
                            icon={flashState ? 'flash-off' : 'flash'}
                            mode="contained-tonal"
                        >
                            {flashState
                                ? t('views.scanTableQrCodeScreen.turnFlashOff')
                                : t('views.scanTableQrCodeScreen.turnFlashOn')}
                        </Button>
                    </Flex>
                </Flex>
            ) : (
                <FlexWithMargin center fill gap={32}>
                    <Icon source="alert-circle" size={64} />
                    <Flex center>
                        <Flex mb={8}>
                            <Text variant="headlineMedium">
                                {t(
                                    'views.scanTableQrCodeScreen.permissionRequired',
                                )}
                            </Text>
                        </Flex>
                        <Text>
                            {t(
                                'views.scanTableQrCodeScreen.permissionRequiredDescription',
                            )}
                        </Text>
                    </Flex>
                    <Flex center style={{ gap: 8 }}>
                        <Flex>
                            <Button
                                mode="contained-tonal"
                                onPress={requestPermission}
                                icon="lock-open"
                            >
                                {t(
                                    'views.scanTableQrCodeScreen.grantPermission',
                                )}
                            </Button>
                        </Flex>
                        <Text>{t('generic.or')}</Text>
                        <Button
                            mode="text"
                            onPress={goBack}
                            style={{ minWidth: 200 }}
                        >
                            {t('generic.goBack')}
                        </Button>
                    </Flex>
                </FlexWithMargin>
            )}
        </AppBarLayout>
    );
};

export default ScanTableQrCodeScreen;
