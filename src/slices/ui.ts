/* eslint-disable no-param-reassign */
import type {
    SetOrderSearch,
    SetProductItemDetailsAction,
    UiState,
} from '@/types/ui';

import { createSlice } from '@reduxjs/toolkit';

const initialState: UiState = {
    productItemDetails: null,

    // order search
    orderSearch: '',
    showOrderSearch: false,
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
        toggleOrderSearch: state => {
            state.showOrderSearch = !state.showOrderSearch;
            if (!state.showOrderSearch) {
                state.orderSearch = '';
            }
        },
        setOrderSearch: (state, action: SetOrderSearch) => {
            state.orderSearch = action.payload.search;
        },
        clearOrderSearch: state => {
            state.orderSearch = '';
        },
    },
});

export const {
    setProductItemDetails,
    closeProductItem,
    toggleOrderSearch,
    setOrderSearch,
    clearOrderSearch,
} = uiSlice.actions;

export const { reducer: UiReducer } = uiSlice;

export default uiSlice.reducer;
