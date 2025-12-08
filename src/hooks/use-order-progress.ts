import { useAppSelector } from '@/store';

/**
 * Returns a number between 0-1 or `null` if no session is started.
 * Returns [progress, count, size]
 *
 * @return [number, number, number] | null
 */
const useOrderProgress = (): [number, number, number] | null =>
    useAppSelector(state => {
        if (!state.persisted.currentSession) {
            return null;
        }

        const items = Object.values(
            state.persisted.currentSession.orderedItems,
        );

        const size = items.length;

        if (size === 0) {
            return [0, 0, 0];
        }

        const received = items.reduce((previousValue, currentValue) => {
            if (currentValue.received) {
                return previousValue + 1;
            }

            return previousValue;
        }, 0);

        return [received / size, received, size];
    });

export default useOrderProgress;
