import type { OrderHistory } from '@/types/history';
import type { OrderItemId } from '@/types/order-items';
import type { ShoppingCart } from '@/types/shopping-cart';

export type ShopId = string & { readonly __brand: unique symbol };

export interface RestaurantInfo {
    shopid: ShopId;
    max: string;
    intervaltime: string;
    shopname: string;
    shoplogo: string;
    phone: string;
    address: string;
    email: string;
    currencydefault: string;
}

export type TableNumber = string & { readonly __brand: unique symbol };

export interface RestaurantSessionInfo {
    tableNumber: TableNumber;
    restaurantId: RestaurantInfo['shopid'];
}

export interface OrderedItem {
    id: OrderItemId;
    received: boolean;
}

export type OrderedItemUuid = string & { readonly __brand: unique symbol };

export interface StoredRestaurantSessionInfo extends RestaurantSessionInfo {
    sessionStart: Date;

    // items that were previously ordered
    orderedItems: Record<OrderedItemUuid, OrderedItem>; // uuid -> { OrderItem.Id , received }

    // cart
    shoppingCart: ShoppingCart;

    // table history
    tableHistory: OrderHistory;
}
