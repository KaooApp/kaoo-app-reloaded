import { RefreshControl, SectionList, View } from 'react-native';
import { useCallback, useMemo, useState } from 'react';

import { Text, useTheme } from 'react-native-paper';
import type { FC } from 'react';

import { generateProductSectionListData } from '@/utils/helpers';

import { useApi } from '@/components/general/ApiFetcher';
import AppBarLayout from '@/components/layout/AppBarLayout';
import ProductItem from '@/components/order/ProductItem';
import { defaultCurrency } from '@/constants';
import { useAppSelector } from '@/store';

const OrderScreen: FC = () => {
    const theme = useTheme();

    const [refreshing, setRefreshing] = useState<boolean>(false);

    const { fetchOrderItems } = useApi();

    const products = useAppSelector(state => state.persisted.orderItems);
    const currency = useAppSelector(
        state =>
            state.persisted.selectedStore.info?.currencydefault ??
            defaultCurrency,
    );
    const tableNumber = useAppSelector(
        state => state.persisted.currentSession?.tableNumber ?? 'unknown',
    );

    const sections = useMemo(
        () => generateProductSectionListData(products),
        [products],
    );

    const handleRefresh = useCallback(async (): Promise<void> => {
        setRefreshing(true);
        await fetchOrderItems();
        setRefreshing(false);
    }, [fetchOrderItems]);

    return (
        <AppBarLayout title={`Order to Table ${tableNumber}`} settings>
            {sections ? (
                <SectionList
                    sections={sections}
                    refreshControl={
                        <RefreshControl
                            onRefresh={handleRefresh}
                            refreshing={refreshing}
                        />
                    }
                    stickySectionHeadersEnabled={true}
                    renderSectionHeader={({ section: { title } }) => (
                        <View
                            style={{ backgroundColor: theme.colors.background }}
                        >
                            <Text
                                variant="titleMedium"
                                style={{
                                    paddingHorizontal: 8,
                                    marginBottom: 4,
                                    fontWeight: 'bold',
                                }}
                            >
                                {title}
                            </Text>
                        </View>
                    )}
                    renderSectionFooter={() => (
                        <View style={{ paddingBottom: 12 }} />
                    )}
                    renderItem={({ item }) => (
                        <ProductItem data={item} currency={currency} />
                    )}
                    keyExtractor={item => item.id}
                />
            ) : null}
        </AppBarLayout>
    );
};

export default OrderScreen;
