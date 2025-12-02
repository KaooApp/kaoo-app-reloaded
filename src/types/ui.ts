import type { PayloadAction } from '@reduxjs/toolkit';

import type { OrderItem } from '@/types/order-items';

export interface UiState {
    productItemDetails: OrderItem['id'] | null;
}

export type SetProductItemDetailsAction = PayloadAction<{
    productId: OrderItem['id'];
}>;
