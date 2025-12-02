import { useAppSelector } from '@/store';

const useItemCountInCart = (): number =>
    useAppSelector(state =>
        Object.values(state.persisted.shoppingCart).reduce((a, b) => a + b, 0),
    );

export default useItemCountInCart;
