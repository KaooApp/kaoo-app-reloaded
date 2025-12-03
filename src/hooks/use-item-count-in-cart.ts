import { useAppSelector } from '@/store';

const useItemCountInCart = (): number =>
    useAppSelector(state =>
        state.persisted.currentSession
            ? Object.values(state.persisted.currentSession.shoppingCart).reduce(
                  (a, b) => a + b,
                  0,
              )
            : 0,
    );

export default useItemCountInCart;
