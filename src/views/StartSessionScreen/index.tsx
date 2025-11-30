import { useEffect, useState } from 'react';

import FastImage from 'react-native-fast-image';
import { Flex } from 'react-native-flex-layout';
import { Button, Text, useTheme } from 'react-native-paper';
import type { FC } from 'react';

import AppBarLayout, {
    modeAppbarHeight,
} from '@/components/layout/AppBarLayout';
import { useAppSelector } from '@/store';

const StartSessionScreen: FC = () => {
    const theme = useTheme();
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);

    const shopInfo = useAppSelector(
        state => state.persisted.selectedStore.info,
    );

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setImageLoaded(false);
    }, [shopInfo?.shoplogo]);

    return (
        <AppBarLayout
            title={
                shopInfo?.shopname
                    ? `Order at ${shopInfo.shopname}`
                    : 'Want to start eating?'
            }
            settings
        >
            <Flex fill center mb={modeAppbarHeight.medium}>
                {shopInfo ? (
                    <Flex center style={{ gap: 24 }}>
                        <Text variant="headlineLarge">{shopInfo.shopname}</Text>
                        <FastImage
                            style={{
                                width: 200,
                                height: 200,
                                borderWidth: imageLoaded ? 1 : 0,
                                borderColor: theme.colors.outline,
                                borderRadius: 12,
                            }}
                            onLoad={() => setImageLoaded(true)}
                            source={{
                                uri: shopInfo.shoplogo,
                            }}
                        />
                        <Button
                            mode="contained-tonal"
                            contentStyle={{ height: 48, width: 200 }}
                            icon="food"
                        >
                            Start eating
                        </Button>
                    </Flex>
                ) : null}
            </Flex>
        </AppBarLayout>
    );
};

export default StartSessionScreen;
