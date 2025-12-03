import { useEffect, useState } from 'react';

import { Box } from 'react-native-flex-layout';
import { Searchbar } from 'react-native-paper';
import Animated, { FadeInUp } from 'react-native-reanimated';
import type { FC } from 'react';

import { useDebounce } from 'use-debounce';

import { setOrderSearch } from '@/slices/ui';
import { useAppDispatch, useAppSelector } from '@/store';

const ProductSearch: FC = () => {
    const dispatch = useAppDispatch();

    const [searchString, setSearchString] = useState<string>('');

    const showSearch = useAppSelector(state => state.ui.showOrderSearch);

    const [debouncedSearchText] = useDebounce(searchString, 120, {
        maxWait: 300,
    });

    useEffect(() => {
        dispatch(setOrderSearch({ search: debouncedSearchText }));
    }, [debouncedSearchText, dispatch]);

    return showSearch ? (
        <Animated.View entering={FadeInUp.springify(150)}>
            <Box ph={12} mb={8}>
                <Searchbar
                    placeholder="Search..."
                    onChangeText={search => {
                        setSearchString(search);
                    }}
                    value={searchString}
                    autoCorrect={false}
                    autoCapitalize="none"
                />
            </Box>
        </Animated.View>
    ) : null;
};

export default ProductSearch;
