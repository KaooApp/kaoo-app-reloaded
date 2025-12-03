import type { OrderItemId } from '@/types/order-items';

import { useAppSelector } from '@/store';

const useIsInCart = ({ id }: { id: OrderItemId | undefined }): boolean =>
    useAppSelector(state => {
        if (!id) {
            return false;
        }

        if (id in state.persisted.shoppingCart) {
            return state.persisted.shoppingCart[id] > 0;
        }

        return false;
    });

export default useIsInCart;
