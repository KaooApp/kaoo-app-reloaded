/* eslint-disable no-param-reassign */
import type { SavedOrderItem } from '@/types/order-items';
import type {
    PersistedState,
    SelectStoreAction,
    SetStoreInfoAction,
    StartRestaurantSessionAction,
    UpdateOrderItemsAction,
} from '@/types/persisted';

import { defaultShopId } from '@/constants';

// import { rootLogging } from '@/utils/root-logging';
import { createSlice, current } from '@reduxjs/toolkit';

const initialState: PersistedState = {
    currentSession: null,
    selectedStore: {
        id: defaultShopId,
        info: null,
    },
    orderItems: null,
    previousOrderItems: null,
};

// const log = rootLogging.extend('SettingsSlice');

const persistedSlice = createSlice({
    name: 'persisted',
    initialState,
    reducers: {
        resetState: () => initialState,
        clearSessionWithoutSave: state => {
            state.currentSession = null;
        },
        startRestaurantSession: (
            state,
            action: StartRestaurantSessionAction,
        ) => {
            state.currentSession = {
                ...action.payload.info,
                sessionStart: new Date(),
            };
        },
        selectStore: (state, action: SelectStoreAction) => {
            state.selectedStore.id = action.payload.shopId;
        },
        setStoreInformation: (state, action: SetStoreInfoAction) => {
            state.selectedStore.info = action.payload.info;
        },
        updateOrderItems: (state, action: UpdateOrderItemsAction) => {
            const currentOrderItems = current(state).orderItems;

            if (currentOrderItems) {
                state.previousOrderItems = {
                    items: currentOrderItems
                        .flatMap(category => category.det)
                        .map(
                            item =>
                                ({
                                    id: item.id,
                                    img: item.img,
                                    name: item.name,
                                    product_id: item.product_id,
                                    cost: item.cost,
                                }) as SavedOrderItem,
                        ),
                    lastUpdated: new Date(),
                };
            }

            state.orderItems = action.payload.orderItems;
        },
    },
});

export const {
    resetState,
    clearSessionWithoutSave,
    startRestaurantSession,
    selectStore,
    setStoreInformation,
    updateOrderItems,
} = persistedSlice.actions;

export const { reducer: PersistedReducer } = persistedSlice;

export default persistedSlice.reducer;
