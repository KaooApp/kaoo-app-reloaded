import { FlatList } from 'react-native';
import { useMemo } from 'react';

import { Flex } from 'react-native-flex-layout';
import { Icon, ProgressBar, Text } from 'react-native-paper';
import type { FC } from 'react';

import type { OrderedItem, OrderedItemUuid } from '@/types/restaurant';

import useOrderProgress from '@/hooks/use-order-progress';

import AppBarLayout from '@/components/layout/AppBarLayout';
import OrderStatusItem from '@/components/status/OrderStatusItem';
import { successColor } from '@/constants';
import { useAppSelector } from '@/store';

const OrderStatusScreen: FC = () => {
    const orderedItems = useAppSelector(
        state => state.persisted.currentSession?.orderedItems ?? [],
    );

    const formattedOrderedItems = useMemo(
        () => Object.entries(orderedItems) as [OrderedItemUuid, OrderedItem][],
        [orderedItems],
    );

    const orderProgress = useOrderProgress();

    return (
        <AppBarLayout title="Status" settings>
            <Flex fill style={{ gap: 16 }}>
                {formattedOrderedItems.length ? (
                    <Flex fill style={{ alignSelf: 'stretch' }}>
                        <FlatList
                            data={formattedOrderedItems}
                            renderItem={({ item: [uuid, data] }) => (
                                <OrderStatusItem uuid={uuid} data={data} />
                            )}
                        />
                    </Flex>
                ) : (
                    <Flex fill center style={{ gap: 8 }}>
                        <Icon source="close" size={48} />
                        <Text variant="headlineMedium">
                            No items ordered yet
                        </Text>
                    </Flex>
                )}
                {orderProgress ? (
                    <Flex
                        inline
                        style={{ alignSelf: 'stretch', gap: 8 }}
                        ph={12}
                        center
                    >
                        <Flex fill>
                            <ProgressBar
                                progress={orderProgress.progress ?? 0}
                                style={{ borderRadius: 4 }}
                                color={
                                    orderProgress.progress === 1
                                        ? successColor
                                        : undefined
                                }
                            />
                        </Flex>
                        <Flex>
                            <Text>
                                {orderProgress.received} / {orderProgress.size}
                            </Text>
                        </Flex>
                    </Flex>
                ) : null}
            </Flex>
        </AppBarLayout>
    );
};

export default OrderStatusScreen;
