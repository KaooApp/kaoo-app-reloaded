export interface RestaurantInfo {
    shopid: string;
    max: string;
    intervaltime: string;
    shopname: string;
    shoplogo: string;
    phone: string;
    address: string;
    email: string;
    currencydefault: string;
}

export interface RestaurantSessionInfo {
    tableNumber: string;
    restaurantId: string;
}

export interface StoredRestaurantSessionInfo extends RestaurantSessionInfo {
    sessionStart: Date;
}
