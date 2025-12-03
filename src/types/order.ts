import type { OrderItemId } from '@/types/order-items';
import type { RestaurantInfo } from '@/types/restaurant';

// Ordering works like this:
// You have one array with the IDs and one with the counts
// [ ID1, ID2, ID3 ]
// [   0,   4,   2 ]
// Also, all numbers are strings in their API

export interface OrderRequest {
    shopid: RestaurantInfo['shopid'];
    ids: OrderItemId[];
    nums: string[]; // Order count
    table_num: string;
    person_count: number;
    adult: number;
    child: number;
}

export interface OrderResponse {
    code: number; // some sort of status code
    msg: string; // message (either be a success message or some error message)
    over: number;
    type: string;
    starttime: string;
}
