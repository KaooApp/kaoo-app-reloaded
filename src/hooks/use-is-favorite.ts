import type { OrderItemId } from '@/types/order-items';

import { useAppSelector } from '@/store';

const useIsFavorite = ({ id }: { id: OrderItemId | undefined }): boolean =>
    useAppSelector(state => {
        if (!id) {
            return false;
        }

        if (!state.persisted.currentSession?.restaurantId) {
            return false;
        }

        const restaurantFavorites =
            state.persisted.favorites[
                state.persisted.currentSession.restaurantId
            ];

        if (restaurantFavorites) {
            return restaurantFavorites.includes(id);
        }

        return false;
    });

export default useIsFavorite;
