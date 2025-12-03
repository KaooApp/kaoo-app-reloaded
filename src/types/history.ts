import type { OrderItemId } from '@/types/order-items';

export interface OrderHistoryItemDetails {
    id: string & { readonly __brand: unique symbol };
    order_id: OrderHistoryItem['id'];
    goodsid: OrderItemId;
    img: string;
    goodsname: string;
    goodscount: string;
    goodscost: string;
    product_id: string & { readonly __brand: unique symbol };
}

export interface OrderHistoryItem {
    id: string & { readonly __brand: unique symbol }; // a unix timestamp is used as an order id
    dno: string;
    time: string;
    det: OrderHistoryItemDetails[];
}

export type OrderHistory = OrderHistoryItem[];
