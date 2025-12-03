import { Image } from 'react-native';

import { Button, Text } from 'react-native-paper';
import type { FC } from 'react';

import AppBarLayout from '@/components/layout/AppBarLayout';
import FlexWithMargin from '@/components/layout/FlexWithMargin';

import roll from '@assets/roll.png';

import { useNavigation } from '@react-navigation/native';

const StartScreen: FC = () => {
    const { navigate } = useNavigation();

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
                >
                    Scan QR code
                </Button>
                <Text>or</Text>
                <Button
                    mode="outlined"
                    onPress={() => {
                        navigate('ManuallyEnterTableScreen');
                    }}
                    icon="keyboard"
                >
                    Manually enter table
                </Button>
            </FlexWithMargin>
        </AppBarLayout>
    );
};

export default StartScreen;
