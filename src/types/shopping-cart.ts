import type { OrderItemId } from '@/types/order-items';

export type ShoppingCart = Record<OrderItemId, number>; // OrderItem.id -> count
