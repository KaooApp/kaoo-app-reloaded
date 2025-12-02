import type { OrderItem } from '@/types/order-items';

export type ShoppingCart = Record<OrderItem['id'], number>; // OrderItem.id -> count
