import { RefreshControl, SectionList, View } from 'react-native';
import { useCallback, useMemo, useState } from 'react';

import { Flex } from 'react-native-flex-layout';
import { Text, useTheme } from 'react-native-paper';
import type { FC } from 'react';

import { generateHistorySectionListData } from '@/utils/helpers';

import { useApi } from '@/components/general/ApiFetcher';
import HistoryItem from '@/components/history/HistoryItem';
import AppBarLayout from '@/components/layout/AppBarLayout';
import { defaultCurrency } from '@/constants';
import { useAppSelector } from '@/store';

const OrderHistoryScreen: FC = () => {
    const theme = useTheme();

    const [refreshing, setRefreshing] = useState<boolean>(false);

    const { fetchTableOrderHistory } = useApi();

    const currency = useAppSelector(
        state =>
            state.persisted.selectedStore.info?.currencydefault ??
            defaultCurrency,
    );

    const history = useAppSelector(
        state => state.persisted.currentSession?.tableHistory,
    );

    const sections = useMemo(
        () => (history ? generateHistorySectionListData(history) : []),
        [history],
    );

    const handleRefresh = useCallback(async (): Promise<void> => {
        setRefreshing(true);
        await fetchTableOrderHistory();
        setRefreshing(false);
    }, [fetchTableOrderHistory]);

    return (
        <AppBarLayout title="OrderHistoryScreen" settings hasTabs>
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
                    renderSectionHeader={({ section: { title, time } }) => (
                        <Flex
                            inline
                            items="center"
                            justify="between"
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
                            <Text>{time}</Text>
                        </Flex>
                    )}
                    renderSectionFooter={() => (
                        <View style={{ paddingBottom: 12 }} />
                    )}
                    renderItem={({ item }) => (
                        <HistoryItem data={item} currency={currency} />
                    )}
                    keyExtractor={item => item.id}
                />
            ) : null}
        </AppBarLayout>
    );
};

export default OrderHistoryScreen;
