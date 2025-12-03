// noinspection HttpUrlsUsage

import type { OrderHistory } from '@/types/history';
import type { OrderRequest, OrderResponse } from '@/types/order';
import type { OrderItemCategory, OrderItemId } from '@/types/order-items';
import type { PersistedState } from '@/types/persisted';
import type { RestaurantInfo, RestaurantSessionInfo } from '@/types/restaurant';
import type { ShoppingCart } from '@/types/shopping-cart';

import rootLogging from '@/utils/root-logging';

const log = rootLogging.extend('api');

export const apiBaseUrl = 'http://order.huaqiaobang.com';

export const getImageUrl = (imgUrl?: string): string | undefined => {
    if (imgUrl?.startsWith('/')) {
        return `${apiBaseUrl}${imgUrl}`;
    }

    return imgUrl;
};

export const request = async (path: string): Promise<unknown> => {
    log.info(`Fetching from API: ${apiBaseUrl}/${path}`);

    const response = await fetch(`${apiBaseUrl}/${path}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    log.info(
        `Received response from API: ${response.status}, ok=${response.ok}`,
    );

    return response.json();
};

export type FetchOrderItemsResponse = OrderItemCategory[];

export const getOrderItems = async ({
    shopId,
}: {
    shopId: string;
}): Promise<FetchOrderItemsResponse | null> => {
    // http://order.huaqiaobang.com/index.php?ctrl=shop&action=jmGetGoodsType&id=323
    log.info(`[getOrderItems] Fetching order items for ${shopId}`);
    const data = await request(
        `/index.php?ctrl=shop&action=jmGetGoodsType&id=${shopId}`,
    );

    if (!Array.isArray(data)) {
        log.warn('[getOrderItems] Invalid data received: Not an array');
        return null;
    }

    return data;
};

export const getTableOrderHistory = async ({
    shopId,
    tableNumber,
}: {
    shopId: string;
    tableNumber: string;
}): Promise<OrderHistory | null> => {
    log.info('[getOrderHistory] Fetching order history...');
    // http://order.huaqiaobang.com/index.php?ctrl=order&action=jmOrderHistory&shopid=323&table_num=A16
    const data = await request(
        `/index.php?ctrl=order&action=jmOrderHistory&shopid=${shopId}&table_num=${tableNumber}`,
    );

    if (!Array.isArray(data)) {
        log.warn('[getOrderHistory] Invalid data received: Not an array');
        return null;
    }

    return data;
};

export const sendOrder = async (
    order: OrderRequest,
): Promise<OrderResponse | null> => {
    // http://order.huaqiaobang.com/index.php?ctrl=order&action=makeorder&sho/pid=323&contactname=1&address=1&minit=81000&ids=24833,24834,24837&nums=1,1,1&table_num=B20&person_count=8&adult=4&child=4&pscost=0.00
    const {
        shopid,
        ids,
        nums,
        table_num: tableNum,
        person_count: personCount,
        adult,
        child,
    } = order;

    const url = `/index.php?ctrl=order&action=makeorder&shopid=${shopid}&contactname=1&address=1&minit=81000&ids=${ids.join(
        ',',
    )}&nums=${nums.join(
        ',',
    )}&table_num=${tableNum}&person_count=${personCount}&adult=${adult}&child=${child}&pscost=0.00`;

    log.info(`[sendOrder] Sending order (url=${url})`);

    const data = await request(url);

    log.info(`[sendOrder] API returned: '${JSON.stringify(data)}'`);

    if (typeof data !== 'object' || data === null) {
        log.warn('[sendOrder] Invalid data received: Not an object');
        return null;
    }

    return data as OrderResponse;
};

export const getRestaurantInfo = async ({
    shopId,
}: {
    shopId: string;
}): Promise<RestaurantInfo | null> => {
    // http://order.huaqiaobang.com/index.php?ctrl=shop&action=jmGetShopInfo&id=319
    log.info(
        `[getRestaurantInfo] Fetching restaurant information for ${shopId}`,
    );
    const data = await request(
        `/index.php?ctrl=shop&action=jmGetShopInfo&id=${shopId}`,
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

    return null;
};

export const prepareOrder = ({
    cart,
    personCount,
    shopId,
    tableNumber,
}: {
    cart: ShoppingCart;
    personCount: PersistedState['personCount'];
    shopId: RestaurantInfo['shopid'];
    tableNumber: RestaurantSessionInfo['tableNumber'];
}): OrderRequest => {
    const orderRequest: OrderRequest = {
        child: personCount.children,
        adult: personCount.adults,
        person_count: personCount.children + personCount.adults,
        ids: [],
        nums: [],
        shopid: shopId,
        table_num: tableNumber,
    };

    for (const [itemId, count] of Object.entries(cart) as [
        OrderItemId,
        number,
    ][]) {
        orderRequest.ids.push(itemId);
        orderRequest.nums.push(count.toString());
    }

    return orderRequest;
};
