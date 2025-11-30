// noinspection HttpUrlsUsage

import type { OrderItemCategory } from '@/types/order-items';
import type { RestaurantInfo } from '@/types/restaurant';

import rootLogging from '@/utils/root-logging';

const log = rootLogging.extend('api');

export const request = async (path: string): Promise<unknown> => {
    log.info(`Fetching from API: ${path}`);

    const response = await fetch(path, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
};

export type FetchOrderItemsResponse = OrderItemCategory[];

export const getOrderItems = async ({
    shopId,
}: {
    shopId: string;
}): Promise<FetchOrderItemsResponse | null> => {
    // http://order.huaqiaobang.com/index.php?ctrl=shop&action=jmGetGoodsType&id=323
    log.info(`Fetching order items for ${shopId}`);
    const data = await request(
        `http://order.huaqiaobang.com/index.php?ctrl=shop&action=jmGetGoodsType&id=${shopId}`,
    );

    if (!Array.isArray(data)) {
        log.warn('[fetchOrderItems] Invalid data received: Not an array');
        return null;
    }

    return data;
};

/*
export const getOrderHistory = async (
    shopId: string,
    tableNumber: string,
): Promise<OrderHistory> => {
    console.log('Getting order history...');
    // http://order.huaqiaobang.com/index.php?ctrl=order&action=jmOrderHistory&shopid=323&table_num=A16
    return request(
        `http://order.huaqiaobang.com/index.php?ctrl=order&action=jmOrderHistory&shopid=${shopId}&table_num=${tableNumber}`,
    );
};

export const makeOrder = async (
    order: OrderRequest,
): Promise<OrderResponse | void> => {
    // http://order.huaqiaobang.com/index.php?ctrl=order&action=makeorder&sho/pid=323&contactname=1&address=1&minit=81000&ids=24833,24834,24837&nums=1,1,1&table_num=B20&person_count=8&adult=4&child=4&pscost=0.00
    const { shopid, ids, nums, table_num, person_count, adult, child } = order;

    const url = `http://order.huaqiaobang.com/index.php?ctrl=order&action=makeorder&shopid=${shopid}&contactname=1&address=1&minit=81000&ids=${ids.join(
        ',',
    )}&nums=${nums.join(
        ',',
    )}&table_num=${table_num}&person_count=${person_count}&adult=${adult}&child=${child}&pscost=0.00`;
    console.log('Making order...', url);
    return request(url);
}; */

export const getRestaurantInfo = async ({
    shopId,
}: {
    shopId: string;
}): Promise<RestaurantInfo | null> => {
    // http://order.huaqiaobang.com/index.php?ctrl=shop&action=jmGetShopInfo&id=319
    log.info(`Fetching restaurant information for ${shopId}`);
    const data = await request(
        `http://order.huaqiaobang.com/index.php?ctrl=shop&action=jmGetShopInfo&id=${shopId}`,
    );

    if (typeof data !== 'object' || data === null) {
        log.warn('[getRestaurantInfo] Invalid data received: Not an object');
        return null;
    }

    if (
        'max' in data &&
        'intervaltime' in data &&
        'shopname' in data &&
        'shoplogo' in data &&
        'phone' in data &&
        'address' in data &&
        'email' in data &&
        'currencydefault' in data
    ) {
        return data as RestaurantInfo;
    }

    log.warn('[getRestaurantInfo] Invalid data received: Missing attributes');
    console.log(data);

    return null;
};
