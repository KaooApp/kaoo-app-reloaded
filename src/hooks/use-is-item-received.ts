import type { OrderedItemUuid } from '@/types/restaurant';

import { useAppSelector } from '@/store';

const useIsItemReceived = ({
    uuid,
}: {
    uuid: OrderedItemUuid | undefined;
}): boolean =>
    useAppSelector(state => {
        if (!uuid) {
            return false;
        }

        if (!state.persisted.currentSession) {
            return false;
        }

        if (uuid in state.persisted.currentSession.orderedItems) {
            return state.persisted.currentSession.orderedItems[uuid].received;
        }

        return false;
    });

export default useIsItemReceived;
