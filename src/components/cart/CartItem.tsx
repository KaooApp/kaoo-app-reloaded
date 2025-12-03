import { useCallback } from 'react';

import FastImage from 'react-native-fast-image';
import { Box, Flex } from 'react-native-flex-layout';
import { Icon, Surface, Text, TouchableRipple } from 'react-native-paper';
import type { FC } from 'react';

import type { OrderItemId } from '@/types/order-items';

import useOrderItem from '@/hooks/use-order-item';

import { getImageUrl } from '@/utils/api';
import { fixItemName } from '@/utils/helpers';

import { setProductItemDetails } from '@/slices/ui';
import { useAppDispatch } from '@/store';

export interface ProductItemProps {
    id: OrderItemId;
    count: number;
}

const CartItem: FC<ProductItemProps> = ({ id, count }) => {
    const dispatch = useAppDispatch();

    const data = useOrderItem({ id });

    const handleOnPress = useCallback(() => {
        dispatch(setProductItemDetails({ productId: id }));
    }, [dispatch, id]);

    if (!data) {
        return null;
    }

    return (
        <Flex ph={12} pv={4}>
            <TouchableRipple
                onPress={handleOnPress}
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
                                source={{ uri: getImageUrl(data.img) }}
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 8,
                                }}
                            />
                        </Box>
                        <Text variant="titleMedium">
                            {count} &times; {data.product_id}.{' '}
                            {fixItemName(data.name)}
                        </Text>
                        <Flex fill inline justify="end" items="center">
                            <Icon source="chevron-right" size={24} />
                        </Flex>
                    </Flex>
                </Surface>
            </TouchableRipple>
        </Flex>
    );
};

export default CartItem;
