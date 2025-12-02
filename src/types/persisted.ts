import type { PayloadAction } from '@reduxjs/toolkit';

import type { Favorites } from '@/types/favorites';
import type { OrderItem, SavedOrderItem } from '@/types/order-items';
import type {
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
        items: SavedOrderItem[];
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
    id: OrderItem['id'];
}>;

export type RemoveItemFromCartAction = PayloadAction<{
    id: OrderItem['id'];
}>;

export type DeleteItemFromCartAction = PayloadAction<{
    id: OrderItem['id'];
}>;

export type AddItemToFavoritesAction = PayloadAction<{
    id: OrderItem['id'];
}>;

export type RemoveItemFromFavoritesAction = PayloadAction<{
    id: OrderItem['id'];
}>;

export type SetItemInFavoritesAction = PayloadAction<{
    id: OrderItem['id'];
    favorite: boolean;
}>;
