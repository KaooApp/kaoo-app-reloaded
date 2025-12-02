/* eslint-disable no-param-reassign */
import type { SavedOrderItem } from '@/types/order-items';
import type {
    AddItemToCartAction,
    AddItemToFavoritesAction,
    DeleteItemFromCartAction,
    PersistedState,
    RemoveItemFromCartAction,
    RemoveItemFromFavoritesAction,
    SelectStoreAction,
    SetItemInFavoritesAction,
    SetStoreInfoAction,
    StartRestaurantSessionAction,
    UpdateOrderItemsAction,
} from '@/types/persisted';

import { hasDifferentOrderItems } from '@/utils/helpers';
import rootLogging from '@/utils/root-logging';

import { defaultShopId } from '@/constants';

import { createSlice, current } from '@reduxjs/toolkit';

const initialState: PersistedState = {
    // session
    currentSession: null,
    selectedStore: {
        id: defaultShopId,
        info: null,
    },

    // persons on the table, relevant for rate limit
    personCount: {
        adults: 4,
        children: 4,
    },

    // cart
    shoppingCart: {},

    // favorites
    favorites: {},

    // order items
    orderItems: null,
    previousOrderItems: null,
};

const log = rootLogging.extend('SettingsSlice');

const persistedSlice = createSlice({
    name: 'persisted',
    initialState,
    reducers: {
        resetState: () => initialState,

        // === Session === //
        clearSessionWithoutSave: state => {
            state.currentSession = null;
        },
        startRestaurantSession: (
            state,
            action: StartRestaurantSessionAction,
        ) => {
            const restaurantId = current(state).selectedStore.id;

            state.currentSession = {
                ...action.payload.info,
                restaurantId,
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

            if (
                currentOrderItems &&
                hasDifferentOrderItems(
                    currentOrderItems,
                    action.payload.orderItems,
                )
            ) {
                log.info('Found different items, rewriting previousOrderItems');
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
                        )
                        .splice(0, 2),
                    lastUpdated: new Date(),
                };
            } else {
                log.info('Items did not change');
            }

            state.orderItems = action.payload.orderItems;
        },

        // === cart === //
        addItemToCart: (state, action: AddItemToCartAction) => {
            const { id } = action.payload;

            if (typeof state.shoppingCart[id] !== 'number') {
                state.shoppingCart[id] = 0;
            }

            state.shoppingCart[id] += 1;
        },
        removeItemFromCart: (state, action: RemoveItemFromCartAction) => {
            const { id } = action.payload;

            if (typeof state.shoppingCart[id] !== 'number') {
                state.shoppingCart[id] = 0;
            }

            if (state.shoppingCart[id] > 1) {
                state.shoppingCart[id] -= 1;
            } else if (state.shoppingCart[id] > 0) {
                delete state.shoppingCart[id];
            }
        },
        deleteItemFromCart: (state, action: DeleteItemFromCartAction) => {
            const { id } = action.payload;

            if (typeof state.shoppingCart[id] === 'number') {
                delete state.shoppingCart[id];
            }
        },
        clearCartAction: state => {
            state.shoppingCart = {};
        },

        // === favorites === //
        addItemToFavorites: (state, action: AddItemToFavoritesAction) => {},
        removeItemFromFavorites: (
            state,
            action: RemoveItemFromFavoritesAction,
        ) => {},
        setItemInFavorites: (state, action: SetItemInFavoritesAction) => {
            const { id, favorite } = action.payload;
            const shopId = state.currentSession?.restaurantId;

            if (!shopId) {
                return;
            }

            if (!Array.isArray(state.favorites[shopId])) {
                state.favorites[shopId] = [];
            }

            if (favorite) {
                state.favorites[shopId].push(id);
            } else {
                state.favorites[shopId] = state.favorites[shopId].filter(
                    itemId => itemId !== id,
                );
            }
        },
        clearFavorites: state => {
            state.favorites = {};
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
    addItemToCart,
    removeItemFromCart,
    deleteItemFromCart,
    clearCartAction,
    addItemToFavorites,
    removeItemFromFavorites,
    setItemInFavorites,
    clearFavorites,
} = persistedSlice.actions;

export const { reducer: PersistedReducer } = persistedSlice;

export default persistedSlice.reducer;
