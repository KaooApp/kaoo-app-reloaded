import type { PayloadAction } from '@reduxjs/toolkit';

import type { OrderItemId } from '@/types/order-items';

export interface UiState {
    productItemDetails: OrderItemId | null;
    showOrderSearch: boolean;
    orderSearch: string;
}

export type SetProductItemDetailsAction = PayloadAction<{
    productId: OrderItemId;
}>;

export type SetOrderSearch = PayloadAction<{
    search: string;
}>;
