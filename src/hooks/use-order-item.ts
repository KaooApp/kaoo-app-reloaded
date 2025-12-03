import type { OrderItem, OrderItemId } from '@/types/order-items';

import { useAppSelector } from '@/store';

const useOrderItem = ({
    id,
}: {
    id: OrderItemId | undefined;
}): OrderItem | null =>
    useAppSelector(state => {
        if (!id) {
            return null;
        }

        return (
            state.persisted.orderItems
                ?.flatMap(category => category.det)
                .find(item => item.id === id) ?? null
        );
    });

export default useOrderItem;
