import { createContext, useCallback, useContext, useEffect } from 'react';

import Toast from 'react-native-toast-message';
import type { FC, PropsWithChildren } from 'react';

import type { RestaurantInfo } from '@/types/restaurant';

import type { FetchOrderItemsResponse } from '@/utils/api';
import { getOrderItems, getRestaurantInfo } from '@/utils/api';
import rootLogging from '@/utils/root-logging';

import { defaultShopId } from '@/constants';
import {
    selectStore,
    setStoreInformation,
    updateOrderItems,
} from '@/slices/persisted';
import { useAppDispatch, useAppSelector } from '@/store';

export interface ApiContext {
    fetchRestaurantInfo: () => ReturnType<typeof getRestaurantInfo>;
    fetchOrderItems: () => ReturnType<typeof getOrderItems>;
}

const apiContext = createContext<ApiContext | null>(null);

const log = rootLogging.extend('ApiFetcher');

const ApiFetcher: FC<PropsWithChildren> = ({ children }) => {
    const dispatch = useAppDispatch();

    const selectedShopId = useAppSelector(
        state => state.persisted.selectedStore.id,
    );
    const fetchedShopId = useAppSelector(
        state => state.persisted.selectedStore.info?.shopid,
    );

    const fetchRestaurantInfo =
        useCallback(async (): Promise<RestaurantInfo | null> => {
            log.info('Fetching restaurant info from ApiContext');
            const data = await getRestaurantInfo({ shopId: selectedShopId });

            if (data === null) {
                log.error('Failed to fetch restaurant info from ApiContext');
                Toast.show({
                    text1: 'Unable to fetch restaurant information',
                    type: 'error',
                });
            } else {
                dispatch(setStoreInformation({ info: data }));
            }

            return data;
        }, [dispatch, selectedShopId]);

    const fetchOrderItems =
        useCallback(async (): Promise<FetchOrderItemsResponse | null> => {
            log.info('Fetching order items from ApiContext');
            const data = await getOrderItems({ shopId: selectedShopId });

            if (data === null) {
                log.error('Failed to fetch order items from ApiContext');
                Toast.show({
                    text1: 'Unable to fetch order items',
                    type: 'error',
                });
            } else {
                dispatch(updateOrderItems({ orderItems: data }));
            }

            return data;
        }, [dispatch, selectedShopId]);

    useEffect(() => {
        if (typeof selectedShopId !== 'string' || !selectedShopId) {
            dispatch(selectStore({ shopId: defaultShopId }));
        }
    }, [dispatch, selectedShopId]);

    useEffect(() => {
        if (
            typeof fetchedShopId !== 'string' ||
            fetchedShopId !== selectedShopId
        ) {
            fetchRestaurantInfo().then(async () => {
                // fetch items of that restaurant
                await fetchOrderItems();
            });
        }
    }, [
        dispatch,
        fetchOrderItems,
        fetchRestaurantInfo,
        fetchedShopId,
        selectedShopId,
    ]);

    return (
        <apiContext.Provider
            value={{
                fetchRestaurantInfo,
                fetchOrderItems,
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
