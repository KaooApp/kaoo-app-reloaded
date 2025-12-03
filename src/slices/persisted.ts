/* eslint-disable no-param-reassign */
import uuid from 'react-native-uuid';

import type { OrderItemId, PreviousOrderItem } from '@/types/order-items';
import type {
    AddCartToSessionAction,
    AddItemToCartAction,
    AddItemToFavoritesAction,
    DeleteItemFromCartAction,
    PersistedState,
    RemoveItemFromCartAction,
    RemoveItemFromFavoritesAction,
    SelectStoreAction,
    SetItemInFavoritesAction,
    SetItemReceivedAction,
    SetOrderHistoryAction,
    SetStoreInfoAction,
    StartRestaurantSessionAction,
    UpdateOrderItemsAction,
} from '@/types/persisted';
import type {
    OrderedItem,
    OrderedItemUuid,
    PastRestaurantSessionInfo,
    StoredRestaurantSessionInfo,
} from '@/types/restaurant';

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
    pastSessions: [],

    // persons on the table, relevant for rate limit
    personCount: {
        adults: 4,
        children: 4,
    },

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
                tableNumber: action.payload.info.tableNumber,
                restaurantId,
                sessionStart: new Date(),
                orderedItems: {},
                shoppingCart: {},
                tableHistory: [],
            } as StoredRestaurantSessionInfo;
        },
        endRestaurantSession: state => {
            const { currentSession, orderItems } = current(state);

            if (currentSession === null || orderItems === null) {
                return;
            }

            const { restaurantId, tableNumber, sessionStart, orderedItems } =
                currentSession;

            const sessionRecord: PastRestaurantSessionInfo = {
                restaurantId,
                tableNumber,
                orderedItems,
                sessionStart,
                sessionEnd: new Date(),
                itemInformation: {},
            };

            const flatOrderItems = orderItems.flatMap(category => category.det);

            for (const orderedItem of Object.values(orderedItems)) {
                if (orderedItem.id in sessionRecord.itemInformation) {
                    continue;
                }

                const item = flatOrderItems.find(
                    orderItem => orderItem.id === orderedItem.id,
                );

                if (item) {
                    sessionRecord.itemInformation[item.id as OrderItemId] = {
                        name: item.name,
                        product_id: item.product_id,
                        cost: item.cost,
                        img: item.img,
                    };
                }
            }

            state.pastSessions.push(sessionRecord);

            state.currentSession = null;
            state.orderItems = null;
            state.personCount = initialState.personCount;
        },
        addCartToSession: (state, action: AddCartToSessionAction) => {
            if (!state.currentSession) {
                return;
            }

            const { cart } = action.payload;

            for (const [itemId, count] of Object.entries(cart) as [
                OrderItemId,
                number,
            ][]) {
                for (let i = 0; i < count; i++) {
                    state.currentSession.orderedItems[
                        uuid.v4() as OrderedItemUuid
                    ] = {
                        id: itemId,
                        received: false,
                    } as OrderedItem;
                }
            }
        },
        setItemReceived: (state, action: SetItemReceivedAction) => {
            if (!state.currentSession) {
                return;
            }

            const { uuid: itemId, received } = action.payload;

            if (state.currentSession.orderedItems[itemId]) {
                state.currentSession.orderedItems[itemId].received = received;
            }
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
                                }) as PreviousOrderItem,
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
            if (!state.currentSession) {
                return;
            }

            const { id } = action.payload;

            if (typeof state.currentSession.shoppingCart[id] !== 'number') {
                state.currentSession.shoppingCart[id] = 0;
            }

            state.currentSession.shoppingCart[id] += 1;
        },
        removeItemFromCart: (state, action: RemoveItemFromCartAction) => {
            if (!state.currentSession) {
                return;
            }

            const { id } = action.payload;

            if (typeof state.currentSession.shoppingCart[id] !== 'number') {
                state.currentSession.shoppingCart[id] = 0;
            }

            if (state.currentSession.shoppingCart[id] > 1) {
                state.currentSession.shoppingCart[id] -= 1;
            } else if (state.currentSession.shoppingCart[id] > 0) {
                delete state.currentSession.shoppingCart[id];
            }
        },
        deleteItemFromCart: (state, action: DeleteItemFromCartAction) => {
            if (!state.currentSession) {
                return;
            }

            const { id } = action.payload;

            if (typeof state.currentSession.shoppingCart[id] === 'number') {
                delete state.currentSession.shoppingCart[id];
            }
        },
        clearCartAction: state => {
            if (state.currentSession) {
                state.currentSession.shoppingCart = {};
            }
        },

        // === favorites === //
        addItemToFavorites: (state, action: AddItemToFavoritesAction) => {
            const { id } = action.payload;
            const shopId = state.currentSession?.restaurantId;

            if (!shopId) {
                return;
            }

            if (!Array.isArray(state.favorites[shopId])) {
                state.favorites[shopId] = [];
            }

            state.favorites[shopId].push(id);
        },
        removeItemFromFavorites: (
            state,
            action: RemoveItemFromFavoritesAction,
        ) => {
            const { id } = action.payload;
            const shopId = state.currentSession?.restaurantId;

            if (!shopId) {
                return;
            }

            if (!Array.isArray(state.favorites[shopId])) {
                state.favorites[shopId] = [];
            }

            state.favorites[shopId] = state.favorites[shopId].filter(
                itemId => itemId !== id,
            );
        },
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

        // === Order history === //
        setOrderHistory: (state, action: SetOrderHistoryAction) => {
            if (!state.currentSession) {
                return;
            }

            state.currentSession.tableHistory = action.payload.history;
        },
    },
});

export const {
    resetState,
    clearSessionWithoutSave,
    startRestaurantSession,
    endRestaurantSession,
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
    addCartToSession,
    setItemReceived,
    setOrderHistory,
} = persistedSlice.actions;

export const { reducer: PersistedReducer } = persistedSlice;

export default persistedSlice.reducer;
