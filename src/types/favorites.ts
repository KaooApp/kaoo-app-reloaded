import type { OrderItemId } from '@/types/order-items';
import type { RestaurantInfo } from '@/types/restaurant';

export type Favorites = Record<RestaurantInfo['shopid'], OrderItemId[]>; // Restaurant.shopid -> OrderItem.id[]
