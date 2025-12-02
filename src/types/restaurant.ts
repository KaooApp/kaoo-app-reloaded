export interface RestaurantInfo {
    shopid: string & { readonly __brand: unique symbol };
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
    tableNumber: string & { readonly __brand: unique symbol };
    restaurantId: RestaurantInfo['shopid'];
}

export interface StoredRestaurantSessionInfo extends RestaurantSessionInfo {
    sessionStart: Date;
}
