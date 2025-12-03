import { useEffect, useRef } from 'react';

import FastImage from 'react-native-fast-image';
import { Flex } from 'react-native-flex-layout';
import { IconButton, Surface, Text, useTheme } from 'react-native-paper';
import type { FC } from 'react';

import useIsFavorite from '@/hooks/use-is-favorite';

import { findOrderItemById } from '@/utils/helpers';

import {
    addItemToCart,
    removeItemFromCart,
    setItemInFavorites,
} from '@/slices/persisted';
import { closeProductItem } from '@/slices/ui';
import { useAppDispatch, useAppSelector } from '@/store';

import {
    BottomSheetModal,
    BottomSheetView,
    enableLogging,
} from '@gorhom/bottom-sheet';
import {getImageUrl} from '@/utils/api';

if (__DEV__) {
    enableLogging();
}

const ProductItemDetails: FC = () => {
    const theme = useTheme();

    const dispatch = useAppDispatch();

    const product = useAppSelector(state =>
        findOrderItemById(
            state.persisted.orderItems,
            state.ui.productItemDetails,
        ),
    );

    const isFavorite = useIsFavorite({ id: product?.id });

    const productCountInCart = useAppSelector(state => {
        const id = state.ui.productItemDetails;

        if (id === null) {
            return 0;
        }

        if (!(id in state.persisted.shoppingCart)) {
            return 0;
        }

        return state.persisted.shoppingCart[id];
    });

    const increaseItemCount = (): void => {
        if (product) {
            dispatch(addItemToCart({ id: product.id }));
        }
    };

    const decreaseItemCount = (): void => {
        if (product) {
            dispatch(removeItemFromCart({ id: product.id }));
        }
    };

    const handleFavorite = (): void => {
        if (product) {
            dispatch(
                setItemInFavorites({ id: product.id, favorite: !isFavorite }),
            );
        }
    };

    const bottomSheetRef = useRef<BottomSheetModal>(null);

    useEffect(() => {
        if (product !== null) {
            bottomSheetRef.current?.present();
        } else {
            bottomSheetRef.current?.forceClose();
        }
    }, [product]);

    const color = theme.colors.onSurface;

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            onDismiss={() => {
                dispatch(closeProductItem());
            }}
            enablePanDownToClose
            enableDismissOnClose
            snapPoints={['50%']}
            backgroundStyle={{
                backgroundColor: theme.colors.surfaceVariant,
            }}
            handleIndicatorStyle={{
                backgroundColor: color,
            }}
        >
            <BottomSheetView
                style={{ flex: 1, padding: 36, alignItems: 'center', gap: 8 }}
            >
                <Flex inline items="center" style={{ gap: 8 }}>
                    <Text variant="titleLarge" style={{ color }}>
                        {product?.name ?? 'NULL'}
                    </Text>
                    <IconButton
                        icon={isFavorite ? 'heart' : 'heart-outline'}
                        mode="contained"
                        containerColor={theme.colors.error}
                        iconColor={theme.colors.onError}
                        size={24}
                        onPress={handleFavorite}
                    />
                </Flex>
                <FastImage
                    source={{ uri: getImageUrl(product?.img) }}
                    style={{
                        width: 175,
                        height: 175,
                        borderRadius: 24,
                        backgroundColor: theme.colors.background,
                        shadowOffset: {
                            width: 20,
                            height: -20,
                        },
                    }}
                />
                <Flex
                    inline
                    mt={8}
                    items="center"
                    justify="center"
                    style={{ gap: 8 }}
                >
                    <IconButton
                        mode="contained-tonal"
                        icon="plus"
                        size={32}
                        onPress={increaseItemCount}
                    />
                    <Surface
                        mode="flat"
                        style={{
                            height: 48,
                            aspectRatio: '1 / 1',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                        }}
                    >
                        <Text variant="bodyLarge">{productCountInCart}</Text>
                    </Surface>
                    <IconButton
                        mode="contained-tonal"
                        icon="minus"
                        size={32}
                        onPress={decreaseItemCount}
                    />
                </Flex>
            </BottomSheetView>
        </BottomSheetModal>
    );
};

export default ProductItemDetails;
