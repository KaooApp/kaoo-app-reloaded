import type { BarcodeResult } from '@pushpendersingh/react-native-scanner';

import type { SectionListProps } from 'react-native';

import type {
    OrderItem,
    OrderItemCategory,
    SavedOrderItem,
} from '@/types/order-items';

import rootLogging from '@/utils/root-logging';

const log = rootLogging.extend('helpers');

export const convertOrderItems = (items: OrderItem[]): SavedOrderItem[] =>
    items.map(item => ({
        name: item.name,
        cost: item.cost,
        img: item.img,
        product_id: item.product_id,
        id: item.id,
    }));

export const convertBarcodeToTableNumber = (
    barcode: BarcodeResult | undefined,
): string | null => {
    if (!barcode) {
        return null;
    }

    const { data } = barcode;

    try {
        const url = new URL(data);

        // @ts-expect-error: Types from react-native are outdated, see https://github.com/facebook/react-native/issues/54733
        return url.searchParams.get('tablenum');
    } catch (e) {
        log.error('Error converting barcode to table', e);
        return null;
    }
};

export const generateProductSectionListData = (
    data: OrderItemCategory[] | null,
): SectionListProps<OrderItem>['sections'] | null =>
    data?.map(orderItemCategory => ({
        title: orderItemCategory.name,
        key: orderItemCategory.id,
        data: orderItemCategory.det,
    })) ?? null;

export const extractOrderItemIds = (data: OrderItemCategory[]): string[] => {
    const itemIds = [];

    for (const category of data) {
        for (const item of category.det) {
            itemIds.push(item.id);
        }
    }

    return itemIds;
};

export const setsEqual = <T>(set1: Set<T>, set2: Set<T>): boolean =>
    set1.size === set2.size && [...set1].every(x => set2.has(x));

export const hasDifferentOrderItems = (
    previous: OrderItemCategory[],
    current: OrderItemCategory[],
): boolean => {
    const previousIdSet = new Set<string>(extractOrderItemIds(previous));
    const currentIdSet = new Set<string>(extractOrderItemIds(current));

    return !setsEqual(previousIdSet, currentIdSet);
};

export const findOrderItemById = (
    data: OrderItemCategory[] | null,
    itemId: string | null,
): OrderItem | null =>
    itemId
        ? (data
              ?.flatMap(category => category.det)
              .find(item => item.id === itemId) ?? null)
        : null;
