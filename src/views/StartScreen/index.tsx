import { Image } from 'react-native';

import { Button, Text } from 'react-native-paper';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import AppBarLayout from '@/components/layout/AppBarLayout';
import FlexWithMargin from '@/components/layout/FlexWithMargin';
import { useAppSelector } from '@/store';

import roll from '@assets/roll.png';

import { useNavigation } from '@react-navigation/native';

const StartScreen: FC = () => {
    const { navigate } = useNavigation();
    const { t } = useTranslation();

    const hasRestaurantInfo = useAppSelector(
        state => state.persisted.selectedStore.info !== null,
    );

    return (
        <AppBarLayout settings>
            <FlexWithMargin fill center style={{ gap: 16 }}>
                <Image style={{ width: 180, height: 180 }} source={roll} />
                <Button
                    mode="contained-tonal"
                    onPress={() => {
                        navigate('ScanTableQrCodeScreen');
                    }}
                    icon="qrcode"
                    disabled={!hasRestaurantInfo}
                >
                    {t('views.startScreen.scanQrCode')}
                </Button>
                <Text>{t('generic.or')}</Text>
                <Button
                    mode="outlined"
                    onPress={() => {
                        navigate('ManuallyEnterTableScreen');
                    }}
                    icon="keyboard"
                    disabled={!hasRestaurantInfo}
                >
                    {t('views.startScreen.manualTable')}
                </Button>
            </FlexWithMargin>
        </AppBarLayout>
    );
};

export default StartScreen;
