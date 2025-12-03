import type { PayloadAction } from '@reduxjs/toolkit';

import type { OrderItemId } from '@/types/order-items';

export interface UiState {
    productItemDetails: OrderItemId | null;
}

export type SetProductItemDetailsAction = PayloadAction<{
    productId: OrderItemId;
}>;
