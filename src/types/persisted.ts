import type { PayloadAction } from '@reduxjs/toolkit';

import type { Favorites } from '@/types/favorites';
import type { OrderItemId, PreviousOrderItem } from '@/types/order-items';
import type {
    OrderedItemUuid,
    RestaurantInfo,
    RestaurantSessionInfo,
    StoredRestaurantSessionInfo,
} from '@/types/restaurant';
import type { ShoppingCart } from '@/types/shopping-cart';

import type { FetchOrderItemsResponse } from '@/utils/api';

export interface PersistedState {
    currentSession: StoredRestaurantSessionInfo | null;
    selectedStore: {
        id: RestaurantInfo['shopid'];
        info: RestaurantInfo | null; // is null when not fetched
    };

    personCount: {
        adults: number;
        children: number;
    };

    orderItems: FetchOrderItemsResponse | null;
    // previousOrderItems will be compared to a newly fetched list. This can then mark order items as new
    previousOrderItems: {
        items: PreviousOrderItem[];
        lastUpdated: Date;
    } | null;

    // cart
    shoppingCart: ShoppingCart;

    // favorites
    favorites: Favorites;
}

export type StartRestaurantSessionAction = PayloadAction<{
    info: Pick<RestaurantSessionInfo, 'tableNumber'>;
}>;

export type SelectStoreAction = PayloadAction<{
    shopId: PersistedState['selectedStore']['id'];
}>;

export type SetStoreInfoAction = PayloadAction<{
    info: RestaurantInfo;
}>;

export type UpdateOrderItemsAction = PayloadAction<{
    orderItems: FetchOrderItemsResponse;
}>;

export type AddItemToCartAction = PayloadAction<{
    id: OrderItemId;
}>;

export type RemoveItemFromCartAction = PayloadAction<{
    id: OrderItemId;
}>;

export type DeleteItemFromCartAction = PayloadAction<{
    id: OrderItemId;
}>;

export type AddItemToFavoritesAction = PayloadAction<{
    id: OrderItemId;
}>;

export type RemoveItemFromFavoritesAction = PayloadAction<{
    id: OrderItemId;
}>;

export type SetItemInFavoritesAction = PayloadAction<{
    id: OrderItemId;
    favorite: boolean;
}>;

export type AddCartToSessionAction = PayloadAction<{
    cart: ShoppingCart;
}>;

export type SetItemReceivedAction = PayloadAction<{
    uuid: OrderedItemUuid;
    received: boolean;
}>;
