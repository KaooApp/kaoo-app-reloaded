import type { OrderItem } from '@/types/order-items';
import type { RestaurantInfo } from '@/types/restaurant';

export type Favorites = Record<RestaurantInfo['shopid'], OrderItem['id'][]>; // Restaurant.shopid -> OrderItem.id[]
