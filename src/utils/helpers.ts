import type { OrderItem, SavedOrderItem } from '@/types/order-items';

export const convertOrderItems = (items: OrderItem[]): SavedOrderItem[] =>
    items.map(item => ({
        name: item.name,
        cost: item.cost,
        img: item.img,
        product_id: item.product_id,
        id: item.id,
    }));
