export type OrderItemId = string & { readonly __brand: unique symbol };

export interface OrderItem {
    id: OrderItemId;
    product_id: string & { readonly __brand: unique symbol };
    typeid: string; // refers to OrderItemCategory.id
    name: string;
    img: string;
    cost: string;
    count: string;
    sellcount: number;
    printer: string;
}

export type PreviousOrderItem = Pick<
    OrderItem,
    'id' | 'product_id' | 'img' | 'name' | 'cost'
>;

export interface OrderItemCategory {
    id: string;
    name: string;
    det: OrderItem[];
}
