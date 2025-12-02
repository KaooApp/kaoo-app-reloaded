import type { PayloadAction } from '@reduxjs/toolkit';

export interface UiState {
    productItemDetails: string | null;
}

export type SetProductItemDetailsAction = PayloadAction<{
    productId: string;
}>;
