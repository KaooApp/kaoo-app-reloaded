export interface OrderItem {
    id: string;
    product_id: string;
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
