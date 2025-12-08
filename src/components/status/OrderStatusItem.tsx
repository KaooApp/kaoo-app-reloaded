import FastImage from 'react-native-fast-image';
import { Box, Flex } from 'react-native-flex-layout';
import {
    Checkbox,
    Surface,
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';
import type { FC } from 'react';

import type { OrderedItem, OrderedItemUuid } from '@/types/restaurant';

import useIsItemReceived from '@/hooks/use-is-item-received';
import useOrderItem from '@/hooks/use-order-item';

import { getImageUrl } from '@/utils/api';
import { fixItemName } from '@/utils/helpers';

import { setItemReceived } from '@/slices/persisted';
import { useAppDispatch } from '@/store';

export interface OrderStatusItemProps {
    uuid: OrderedItemUuid;
    data: OrderedItem;
}

const OrderStatusItem: FC<OrderStatusItemProps> = ({ data, uuid }) => {
    const dispatch = useAppDispatch();

    const theme = useTheme();
    const itemData = useOrderItem({ id: data.id });

    const isReceived = useIsItemReceived({ uuid });

    const handleToggleReceived = (): void => {
        dispatch(setItemReceived({ uuid, received: !isReceived }));
    };

    if (!itemData) {
        return null;
    }

    return (
        <Flex ph={12} pv={4}>
            <TouchableRipple
                onPress={handleToggleReceived}
                borderless
                style={{ borderRadius: 16 }}
            >
                <Surface style={{ padding: 12 }}>
                    <Flex
                        fill
                        inline
                        items="center"
                        justify="between"
                        style={{ gap: 8 }}
                    >
                        <Flex fill inline items="center" style={{ gap: 16 }}>
                            <FastImage
                                source={{ uri: getImageUrl(itemData.img) }}
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 8,
                                }}
                            />
                            <Flex fill>
                                <Text variant="titleMedium">
                                    {itemData.product_id}.{' '}
                                    {fixItemName(itemData.name)}
                                </Text>
                            </Flex>
                        </Flex>
                        <Flex items="center">
                            <Checkbox
                                status={isReceived ? 'checked' : 'unchecked'}
                                onPress={handleToggleReceived}
                            />
                        </Flex>
                    </Flex>
                </Surface>
            </TouchableRipple>
        </Flex>
    );
};

export default OrderStatusItem;
