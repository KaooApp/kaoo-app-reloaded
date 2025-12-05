import { createContext, useCallback, useContext, useEffect } from 'react';

import Toast from 'react-native-toast-message';
import type { FC, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

import type { OrderHistory } from '@/types/history';
import type { RestaurantInfo } from '@/types/restaurant';

import type { FetchOrderItemsResponse } from '@/utils/api';
import {
    getOrderItems,
    getRestaurantInfo,
    getTableOrderHistory,
} from '@/utils/api';
import rootLogging from '@/utils/root-logging';

import { defaultShopId } from '@/constants';
import {
    selectStore,
    setOrderHistory,
    setStoreInformation,
    updateOrderItems,
} from '@/slices/persisted';
import { useAppDispatch, useAppSelector } from '@/store';

export interface ApiContext {
    fetchRestaurantInfo: () => ReturnType<typeof getRestaurantInfo>;
    fetchOrderItems: () => ReturnType<typeof getOrderItems>;
    fetchTableOrderHistory: () => ReturnType<typeof getTableOrderHistory>;
}

const apiContext = createContext<ApiContext | null>(null);

const log = rootLogging.extend('ApiFetcher');

const ApiFetcher: FC<PropsWithChildren> = ({ children }) => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const selectedShopId = useAppSelector(
        state => state.persisted.selectedStore.id,
    );
    const fetchedShopId = useAppSelector(
        state => state.persisted.selectedStore.info?.shopid,
    );
    const tableNumber = useAppSelector(
        state => state.persisted.currentSession?.tableNumber,
    );

    const fetchRestaurantInfo =
        useCallback(async (): Promise<RestaurantInfo | null> => {
            log.info('Fetching restaurant info from ApiContext');
            const data = await getRestaurantInfo({ shopId: selectedShopId });

            if (data === null) {
                log.error('Failed to fetch restaurant info from ApiContext');
                Toast.show({
                    text1: t(
                        'components.apiFetcher.restaurantInfo.unableToFetch',
                    ),
                    type: 'error',
                });
            } else {
                dispatch(setStoreInformation({ info: data }));
                Toast.show({
                    text1: t(
                        'components.apiFetcher.restaurantInfo.successfullyFetched',
                    ),
                    type: 'success',
                });
            }

            return data;
        }, [dispatch, selectedShopId, t]);

    const fetchOrderItems =
        useCallback(async (): Promise<FetchOrderItemsResponse | null> => {
            log.info('Fetching order items from ApiContext');
            const data = await getOrderItems({ shopId: selectedShopId });

            if (data === null) {
                log.error('Failed to fetch order items from ApiContext');
                Toast.show({
                    text1: t('components.apiFetcher.orderItems.unableToFetch'),
                    type: 'error',
                });
            } else {
                dispatch(updateOrderItems({ orderItems: data }));
            }

            return data;
        }, [dispatch, selectedShopId, t]);

    const fetchTableOrderHistory =
        useCallback(async (): Promise<OrderHistory | null> => {
            if (!tableNumber) {
                log.warn(
                    'Table number enumerates to false, aborting fetchTableOrderHistory()',
                );
                return null;
            }

            log.info(
                `Fetching order history for table '${tableNumber}' from ApiContext`,
            );

            const data = await getTableOrderHistory({
                shopId: selectedShopId,
                tableNumber,
            });

            if (data === null) {
                log.error('Failed to fetch table history from ApiContext');
                Toast.show({
                    text1: t(
                        'components.apiFetcher.orderHistory.unableToFetch',
                    ),
                    type: 'error',
                });
            } else {
                dispatch(setOrderHistory({ history: data }));
            }

            return data;
        }, [dispatch, selectedShopId, tableNumber, t]);

    useEffect(() => {
        log.info('Running selectStore() hook');
        if (typeof selectedShopId !== 'string' || !selectedShopId) {
            log.info('Dispatching in selectStore() hook');
            dispatch(selectStore({ shopId: defaultShopId }));
        } else {
            log.info('Not doing anything in selectStore() hook');
        }
    }, [dispatch, selectedShopId]);

    useEffect(() => {
        log.info('Running fetchRestaurantInfo() hook');
        if (
            typeof fetchedShopId !== 'string' ||
            fetchedShopId !== selectedShopId
        ) {
            log.info('Calling fetchRestaurantInfo() in respective hook');
            fetchRestaurantInfo().then(async () => {
                // fetch items of that restaurant
                log.info(
                    'Calling fetchOrderItems() in fetchRestaurantInfo() hook',
                );
                await fetchOrderItems();
            });
        } else {
            log.info('Not doing anything in fetchRestaurantInfo() hook');
        }
    }, [fetchOrderItems, fetchRestaurantInfo, fetchedShopId, selectedShopId]);

    useEffect(() => {
        log.info('Running fetchTableOrderHistory() hook');
        if (tableNumber) {
            log.info('Calling fetchTableOrderHistory() in respective hook');
            fetchTableOrderHistory();
        } else {
            log.info('Not doing anything in fetchTableOrderHistory() hook');
        }
    }, [fetchTableOrderHistory, tableNumber]);

    return (
        <apiContext.Provider
            value={{
                fetchRestaurantInfo,
                fetchOrderItems,
                fetchTableOrderHistory,
            }}
        >
            {children}
        </apiContext.Provider>
    );
};

export const useApi = (): ApiContext => {
    const ctx = useContext(apiContext);

    if (ctx === null) {
        throw new Error('You cannot call useApi outside of <ApiFetcher />');
    }

    return ctx;
};

export default ApiFetcher;
