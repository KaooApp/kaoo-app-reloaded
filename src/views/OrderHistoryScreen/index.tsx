import { RefreshControl, SectionList, View } from 'react-native';
import { useCallback, useMemo, useState } from 'react';

import { Flex } from 'react-native-flex-layout';
import { ActivityIndicator, Icon, Text, useTheme } from 'react-native-paper';
import type { FC } from 'react';

import {
    generateHistorySectionListData,
    millis,
    minimumTime,
} from '@/utils/helpers';

import { useApi } from '@/components/general/ApiFetcher';
import HistoryItem from '@/components/history/HistoryItem';
import AppBarLayout from '@/components/layout/AppBarLayout';
import { defaultCurrency } from '@/constants';
import { useAppSelector } from '@/store';

const OrderHistoryScreen: FC = () => {
    const theme = useTheme();

    const [refreshing, setRefreshing] = useState<boolean>(false);

    const { fetchTableOrderHistory } = useApi();

    const tableNumber = useAppSelector(
        state => state.persisted.currentSession?.tableNumber,
    );

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

        const before = millis();

        await fetchTableOrderHistory();

        setTimeout(
            () => {
                setRefreshing(false);
            },
            minimumTime(before, 500),
        );
    }, [fetchTableOrderHistory]);

    return (
        <AppBarLayout
            title={`Order history of ${tableNumber ?? 'unknown'}`}
            settings
            hasTabs
            action={
                sections?.length
                    ? undefined
                    : {
                          icon: 'refresh',
                          onPress: handleRefresh,
                      }
            }
        >
            {refreshing ? (
                <Flex fill center style={{ gap: 8 }}>
                    <ActivityIndicator size="large" />
                    <Text variant="headlineMedium">Fetching history...</Text>
                </Flex>
            ) : !sections?.length ? (
                <Flex fill center style={{ gap: 8 }}>
                    <Icon source="close" size={48} />
                    <Text variant="headlineMedium">No history found</Text>
                </Flex>
            ) : (
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
                            ph={8}
                        >
                            <Text
                                variant="titleMedium"
                                style={{
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
            )}
        </AppBarLayout>
    );
};

export default OrderHistoryScreen;
