/* eslint-disable no-param-reassign */
import type { SetProductItemDetailsAction, UiState } from '@/types/ui';

import { createSlice } from '@reduxjs/toolkit';

const initialState: UiState = {
    productItemDetails: null,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setProductItemDetails: (state, action: SetProductItemDetailsAction) => {
            state.productItemDetails = action.payload.productId;
        },
        closeProductItem: state => {
            state.productItemDetails = null;
        },
    },
});

export const { setProductItemDetails, closeProductItem } = uiSlice.actions;

export const { reducer: UiReducer } = uiSlice;

export default uiSlice.reducer;
