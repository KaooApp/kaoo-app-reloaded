export interface OrderItem {
    id: string & { readonly __brand: unique symbol };
    product_id: string & { readonly __brand: unique symbol };
    typeid: string; // refers to OrderItemCategory.id
    name: string;
    img: string;
    cost: string;
    count: string;
    sellcount: number;
    printer: string;
}

export type SavedOrderItem = Pick<
    OrderItem,
    'id' | 'product_id' | 'img' | 'name' | 'cost'
>;

export interface OrderItemCategory {
    id: string;
    name: string;
    det: OrderItem[];
}
