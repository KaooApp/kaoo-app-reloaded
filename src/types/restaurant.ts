import type { OrderItemId } from '@/types/order-items';

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
    orderedItems: Record<OrderedItemUuid, OrderedItem>; // uuid -> { OrderItem.Id , received }
}
