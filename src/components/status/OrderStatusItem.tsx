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

import { setItemReceived } from '@/slices/persisted';
import { useAppDispatch } from '@/store';
import {getImageUrl} from '@/utils/api';
import {fixItemName} from '@/utils/helpers';

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
                        justify="start"
                        style={{ gap: 16 }}
                    >
                        <Box>
                            <FastImage
                                source={{ uri: getImageUrl(itemData.img) }}
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 8,
                                }}
                            />
                        </Box>
                        <Flex>
                            <Text variant="titleMedium">
                                {itemData.product_id}. {fixItemName(itemData.name)}
                            </Text>
                            <Text
                                variant="bodySmall"
                                style={{ color: theme.colors.primary }}
                            >
                                {uuid}
                            </Text>
                        </Flex>
                        <Flex fill inline justify="end" items="center">
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
