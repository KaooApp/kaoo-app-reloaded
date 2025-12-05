import { useCallback, useEffect, useState } from 'react';

import FastImage from 'react-native-fast-image';
import { Flex } from 'react-native-flex-layout';
import { Button, Text, useTheme } from 'react-native-paper';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { getImageUrl } from '@/utils/api';

import AppBarLayout from '@/components/layout/AppBarLayout';
import FlexWithMargin from '@/components/layout/FlexWithMargin';
import { useAppSelector } from '@/store';

import { useFocusEffect, useNavigation } from '@react-navigation/native';

const StartSessionScreen: FC = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();

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
                    ? t('views.startSessionScreen.titleWithName', {
                          name: shopInfo.shopname,
                      })
                    : t('views.startSessionScreen.title')
            }
            settings
        >
            <FlexWithMargin fill center>
                {shopInfo && tableNumber ? (
                    <Flex center style={{ gap: 24 }}>
                        <Text variant="headlineLarge">
                            {t('views.startSessionScreen.shopWithTable', {
                                name: shopInfo.shopname,
                                table: tableNumber,
                            })}
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
                            {t('views.startSessionScreen.startEating')}
                        </Button>
                    </Flex>
                ) : (
                    <Text>
                        Please go into the settings and screenshot everything.
                        This is a bug!
                    </Text>
                )}
            </FlexWithMargin>
        </AppBarLayout>
    );
};

export default StartSessionScreen;
