import type { PayloadAction } from '@reduxjs/toolkit';

import type {
    SavedOrderItem,
} from '@/types/order-items';
import type {
    RestaurantInfo,
    RestaurantSessionInfo,
    StoredRestaurantSessionInfo,
} from '@/types/restaurant';

import type { FetchOrderItemsResponse } from '@/utils/api';

export interface PersistedState {
    currentSession: StoredRestaurantSessionInfo | null;
    selectedStore: {
        id: string;
        info: RestaurantInfo | null; // is null when not fetched
    };
    orderItems: FetchOrderItemsResponse | null;
    // previousOrderItems will be compared to a newly fetched list. This can then mark order items as new
    previousOrderItems: {
        items: SavedOrderItem[];
        lastUpdated: Date;
    } | null;
}

export type StartRestaurantSessionAction = PayloadAction<{
    info: RestaurantSessionInfo;
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
