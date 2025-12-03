import type { OrderItemId } from '@/types/order-items';

import { useAppSelector } from '@/store';

const useIsInCart = ({ id }: { id: OrderItemId | undefined }): boolean =>
    useAppSelector(state => {
        if (!id || !state.persisted.currentSession) {
            return false;
        }

        if (id in state.persisted.currentSession.shoppingCart) {
            return state.persisted.currentSession.shoppingCart[id] > 0;
        }

        return false;
    });

export default useIsInCart;
