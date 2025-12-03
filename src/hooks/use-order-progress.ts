import { useAppSelector } from '@/store';

/**
 * Returns a number between 0-1 or `null` if no session is started
 */
const useOrderProgress = (): {
    progress: number;
    size: number;
    received: number;
} | null =>
    useAppSelector(state => {
        if (!state.persisted.currentSession) {
            return null;
        }

        const items = Object.values(
            state.persisted.currentSession.orderedItems,
        );

        const size = items.length;

        if (size === 0) {
            return { progress: 0, size: 0, received: 0 };
        }

        const received = items.reduce((previousValue, currentValue) => {
            if (currentValue.received) {
                return previousValue + 1;
            }

            return previousValue;
        }, 0);

        return { progress: received / size, received, size };
    });

export default useOrderProgress;
