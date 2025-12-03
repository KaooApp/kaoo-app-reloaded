import { Flex } from 'react-native-flex-layout';
import { Text } from 'react-native-paper';
import type { FC } from 'react';

import AppBarLayout from '@/components/layout/AppBarLayout';

const OrderHistoryScreen: FC = () => (
    <AppBarLayout title="OrderHistoryScreen" settings hasTabs>
        <Flex fill style={{ gap: 16 }} mb={16}>
            <Text>OrderHistoryScreen</Text>
        </Flex>
    </AppBarLayout>
);

export default OrderHistoryScreen;
