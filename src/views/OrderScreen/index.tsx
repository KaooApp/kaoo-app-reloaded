import { RefreshControl, SectionList, View } from 'react-native';
import { useCallback, useMemo, useState } from 'react';

import { Text, useTheme } from 'react-native-paper';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Fuse from 'fuse.js';

import { generateProductSectionListData } from '@/utils/helpers';

import { useApi } from '@/components/general/ApiFetcher';
import AppBarLayout from '@/components/layout/AppBarLayout';
import ProductItem from '@/components/order/ProductItem';
import ProductSearch from '@/components/order/ProductSearch';
import { defaultCurrency } from '@/constants';
import { toggleOrderSearch } from '@/slices/ui';
import { useAppDispatch, useAppSelector } from '@/store';

const OrderScreen: FC = () => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { t } = useTranslation();

    const [refreshing, setRefreshing] = useState<boolean>(false);
    const { fetchOrderItems } = useApi();

    const searchString = useAppSelector(state => state.ui.orderSearch);

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

    const fuseSearch = useMemo(() => {
        if (!sections) {
            return null;
        }

        const flatItems = sections.flatMap(section => section.data);

        return new Fuse(flatItems, {
            keys: ['name', 'product_id'],
            threshold: 0.3,
        });
    }, [sections]);

    const filteredSections = useMemo(() => {
        if (!searchString) {
            return sections ?? [];
        }

        if (!fuseSearch) {
            return [];
        }

        const items = fuseSearch.search(searchString);
        const foundItemIds = items.map(({ item }) => item.id);

        return (
            sections
                ?.map(category => ({
                    ...category,
                    data: category.data.filter(item =>
                        foundItemIds.includes(item.id),
                    ),
                }))
                .filter(category => category.data.length) ?? []
        );
    }, [fuseSearch, searchString, sections]);

    const handleRefresh = useCallback(async (): Promise<void> => {
        setRefreshing(true);
        await fetchOrderItems();
        setRefreshing(false);
    }, [fetchOrderItems]);

    return (
        <AppBarLayout
            title={t('views.orderScreen.title', { table: tableNumber })}
            settings
            hasTabs
            action={{
                icon: 'magnify',
                onPress: () => {
                    dispatch(toggleOrderSearch());
                },
            }}
        >
            {sections?.length ? (
                <>
                    <ProductSearch />
                    <SectionList
                        sections={filteredSections}
                        refreshControl={
                            <RefreshControl
                                onRefresh={handleRefresh}
                                refreshing={refreshing}
                            />
                        }
                        stickySectionHeadersEnabled={true}
                        renderSectionHeader={({ section: { title } }) => (
                            <View
                                style={{
                                    backgroundColor: theme.colors.background,
                                }}
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
                </>
            ) : null}
        </AppBarLayout>
    );
};

export default OrderScreen;
