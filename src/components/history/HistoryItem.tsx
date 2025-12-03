import { useCallback, useMemo } from 'react';

import FastImage from 'react-native-fast-image';
import { Box, Flex } from 'react-native-flex-layout';
import {
    Icon,
    Surface,
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';
import type { FC } from 'react';

import type { OrderHistoryItemDetails } from '@/types/history';

import { getImageUrl } from '@/utils/api';
import { fixItemName } from '@/utils/helpers';

import { setProductItemDetails } from '@/slices/ui';
import { useAppDispatch } from '@/store';

export interface HistoryItemProps {
    data: OrderHistoryItemDetails;
    currency: string;
}

const HistoryItem: FC<HistoryItemProps> = ({ data, currency }) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();

    const handleOnPress = useCallback(() => {
        dispatch(setProductItemDetails({ productId: data.id }));
    }, [dispatch, data.id]);

    const itemIsFree = useMemo(() => {
        const parsedCost = parseFloat(data.goodscost);

        if (Number.isNaN(parsedCost)) {
            return false;
        }

        return parsedCost === 0;
    }, [data.goodscost]);

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
                        <Flex>
                            <Flex inline items="center" style={{ gap: 4 }}>
                                <Text variant="titleMedium">
                                    {data.product_id}.{' '}
                                    {fixItemName(data.goodsname)}
                                </Text>
                            </Flex>
                            <Text
                                variant="bodyMedium"
                                style={{
                                    textDecorationLine: itemIsFree
                                        ? 'line-through'
                                        : undefined,
                                    color: itemIsFree
                                        ? theme.colors.error
                                        : theme.colors.onSurface,
                                }}
                            >
                                {data.goodscost} {currency}
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

export default HistoryItem;
