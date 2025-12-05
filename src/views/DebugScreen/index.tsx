import { ScrollView } from 'react-native';

import { Flex } from 'react-native-flex-layout';
import { Text } from 'react-native-paper';
import type { FC } from 'react';

import AppBarLayout from '@/components/layout/AppBarLayout';
import { useAppSelector } from '@/store';

const DebugScreen: FC = () => {
    const settingsState = useAppSelector(state => state.settings);
    const uiState = useAppSelector(state => state.ui);
    const persistedState = useAppSelector(state => state.persisted);

    return (
        <AppBarLayout title="Debug" back>
            <ScrollView>
                <Flex style={{ gap: 8 }} ph={8}>
                    <Flex>
                        <Text variant="titleMedium">UI state</Text>
                        <Text style={{ fontFamily: 'monospace' }}>
                            {JSON.stringify(uiState, null, 4)}
                        </Text>
                    </Flex>
                    <Flex>
                        <Text variant="titleMedium">Settings state</Text>
                        <Text style={{ fontFamily: 'monospace' }}>
                            {JSON.stringify(settingsState, null, 4)}
                        </Text>
                    </Flex>
                    <Flex>
                        <Text variant="titleMedium">Current state</Text>
                        <Text style={{ fontFamily: 'monospace' }}>
                            {JSON.stringify(
                                {
                                    ...persistedState,
                                    orderItems:
                                        persistedState.orderItems?.map(
                                            category => ({
                                                ...category,
                                                det: category.det.map(item => ({
                                                    name: item.name,
                                                    id: item.id,
                                                    product_id: item.product_id,
                                                    shortened: true,
                                                })),
                                            }),
                                        ) ?? null,
                                },
                                null,
                                4,
                            )}
                        </Text>
                    </Flex>
                </Flex>
            </ScrollView>
        </AppBarLayout>
    );
};

export default DebugScreen;
