import { FlatList } from 'react-native';
import { useCallback, useMemo, useState } from 'react';

import { Flex } from 'react-native-flex-layout';
import { Button, Icon, Text } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import type { OrderItemId } from '@/types/order-items';

import useItemCountInCart from '@/hooks/use-item-count-in-cart';

import { prepareOrder, sendOrder } from '@/utils/api';

import CartItem from '@/components/cart/CartItem';
import AppBarLayout from '@/components/layout/AppBarLayout';
import { addCartToSession, clearCartAction } from '@/slices/persisted';
import { useAppDispatch, useAppSelector } from '@/store';

const SHOW_DEV_BUTTON = false;

const CartScreen: FC = () => {
    const [loading, setLoading] = useState<boolean>();
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const cart = useAppSelector(
        state => state.persisted.currentSession?.shoppingCart,
    );

    const formattedCart = useMemo(
        () => (cart ? (Object.entries(cart) as [OrderItemId, number][]) : []),
        [cart],
    );

    const information = useAppSelector(state => ({
        shopId: state.persisted.currentSession?.restaurantId,
        personCount: state.persisted.personCount,
        tableNumber: state.persisted.currentSession?.tableNumber,
    }));

    const itemsInCart = useItemCountInCart();

    const handleCheckout = useCallback(async () => {
        if (loading) {
            return;
        }

        const { shopId, personCount, tableNumber } = information;

        if (!shopId || !personCount || !tableNumber || !cart) {
            Toast.show({
                text1: t('views.cartScreen.checkoutCreationError'),
                text2: t('generic.missingInformation'),
                type: 'error',
            });
            return;
        }

        setLoading(true);

        const order = prepareOrder({
            cart,
            shopId,
            personCount,
            tableNumber,
        });
        const result = await sendOrder(order);

        if (result) {
            Toast.show({
                text1: t('views.cartScreen.orderPlaced'),
                text2: result.msg,
                type: 'success',
            });
            dispatch(addCartToSession({ cart }));
        } else {
            Toast.show({
                text1: t('views.cartScreen.orderFailed'),
                text2: t('generic.pleaseTryAgainLater'),
                type: 'error',
            });
        }

        dispatch(clearCartAction());

        setLoading(false);
    }, [cart, dispatch, information, loading, t]);

    const devAddCartToSession = (): void => {
        if (cart) {
            dispatch(addCartToSession({ cart }));
        }
    };

    return (
        <AppBarLayout title={t('views.cartScreen.title')} settings hasTabs>
            <Flex fill style={{ gap: 16 }} mb={16}>
                {itemsInCart ? (
                    <Flex fill style={{ alignSelf: 'stretch' }}>
                        <FlatList
                            data={formattedCart}
                            renderItem={({ item: [id, count] }) => (
                                <CartItem id={id} count={count} />
                            )}
                        />
                    </Flex>
                ) : (
                    <Flex fill center style={{ gap: 8 }}>
                        <Icon source="cart-outline" size={48} />
                        <Text variant="headlineMedium">
                            {t('views.cartScreen.noItems')}
                        </Text>
                    </Flex>
                )}
                <Flex ph={12} style={{ alignSelf: 'stretch' }}>
                    <Button
                        onPress={handleCheckout}
                        mode="contained-tonal"
                        icon="cart"
                        loading={loading}
                        disabled={!itemsInCart || SHOW_DEV_BUTTON}
                    >
                        {t('views.cartScreen.checkoutNItems', {
                            count: itemsInCart,
                        })}
                    </Button>
                    {SHOW_DEV_BUTTON ? (
                        <Button
                            onPress={devAddCartToSession}
                            mode="contained-tonal"
                        >
                            Add cart to order status
                        </Button>
                    ) : null}
                </Flex>
            </Flex>
        </AppBarLayout>
    );
};

export default CartScreen;
