import { useCallback, useMemo } from 'react';

import FastImage from 'react-native-fast-image';
import { Flex } from 'react-native-flex-layout';
import {
    Badge,
    Icon,
    Surface,
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';
import type { FC } from 'react';

import type { SavedOrderItem } from '@/types/order-items';

import { setProductItemDetails } from '@/slices/ui';
import { useAppDispatch, useAppSelector } from '@/store';

export interface ProductItemProps {
    data: SavedOrderItem;
    currency: string;
}

const ProductItem: FC<ProductItemProps> = ({ data, currency }) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();

    const itemIsNew = useAppSelector(
        state =>
            typeof state.persisted.previousOrderItems?.items.find(
                item => item.id === data.id,
            ) !== 'undefined',
    );

    const itemIsFree = useMemo(() => {
        const parsedCost = parseFloat(data.cost);

        if (Number.isNaN(parsedCost)) {
            return false;
        }

        return parsedCost === 0;
    }, [data.cost]);

    const handleOnPress = useCallback(() => {
        dispatch(setProductItemDetails({ productId: data.id }));
    }, [dispatch, data.id]);

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
                        <FastImage
                            source={{ uri: data.img }}
                            style={{ width: 48, height: 48, borderRadius: 8 }}
                        />
                        <Flex>
                            <Flex inline items="center" style={{ gap: 4 }}>
                                <Text variant="titleMedium">
                                    {data.product_id}. {data.name}{' '}
                                </Text>
                                <Flex>
                                    <Badge
                                        visible={itemIsNew}
                                        style={{ paddingHorizontal: 6 }}
                                    >
                                        New
                                    </Badge>
                                </Flex>
                            </Flex>
                            <Text
                                variant="bodyMedium"
                                style={{
                                    textDecorationLine: itemIsFree
                                        ? 'line-through'
                                        : undefined,
                                    color: itemIsFree
                                        ? theme.colors.error
                                        : undefined,
                                }}
                            >
                                {data.cost} {currency}
                            </Text>
                        </Flex>
                        <Flex fill inline justify="end" items="center">
                            <Icon source="chevron-right" size={24} />
                        </Flex>
                    </Flex>
                </Surface>
            </TouchableRipple>
        </Flex>
    );
};

export default ProductItem;
