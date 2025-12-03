import { useCallback, useEffect, useState } from 'react';

import FastImage from 'react-native-fast-image';
import { Flex } from 'react-native-flex-layout';
import { Button, Text, useTheme } from 'react-native-paper';
import type { FC } from 'react';

import AppBarLayout from '@/components/layout/AppBarLayout';
import FlexWithMargin from '@/components/layout/FlexWithMargin';
import { useAppSelector } from '@/store';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {getImageUrl} from '@/utils/api';

const StartSessionScreen: FC = () => {
    const navigation = useNavigation();

    const theme = useTheme();
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);

    const shopInfo = useAppSelector(
        state => state.persisted.selectedStore.info,
    );

    const tableNumber = useAppSelector(
        state => state.persisted.currentSession?.tableNumber,
    );

    useFocusEffect(
        useCallback(() => {
            if (!shopInfo || !tableNumber) {
                navigation.goBack();
            }
        }, [navigation, shopInfo, tableNumber]),
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
            <FlexWithMargin fill center>
                {shopInfo && tableNumber ? (
                    <Flex center style={{ gap: 24 }}>
                        <Text variant="headlineLarge">
                            {shopInfo.shopname} - Table {tableNumber}
                        </Text>
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
                                uri: getImageUrl(shopInfo.shoplogo),
                            }}
                        />
                        <Button
                            mode="contained-tonal"
                            contentStyle={{ height: 48, width: 200 }}
                            icon="food"
                            onPress={() => {
                                navigation.navigate('OrderTabs');
                            }}
                        >
                            Start eating!
                        </Button>
                    </Flex>
                ) : (
                    <Text>This is invalid</Text>
                )}
            </FlexWithMargin>
        </AppBarLayout>
    );
};

export default StartSessionScreen;
