import { useCallback, useState } from 'react';

import { Flex } from 'react-native-flex-layout';
import { Button, Text, TextInput } from 'react-native-paper';
import type { FC } from 'react';

import AppBarLayout from '@/components/layout/AppBarLayout';
import FlexWithMargin from '@/components/layout/FlexWithMargin';
import { startRestaurantSession } from '@/slices/persisted';
import { useAppDispatch } from '@/store';

import { useNavigation } from '@react-navigation/native';

const ManuallyEnterTableScreen: FC = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    const [tableNumber, setTableNumber] = useState<string>('');

    const handleContinue = useCallback(() => {
        if (tableNumber.length < 1) {
            return;
        }

        dispatch(startRestaurantSession({ info: { tableNumber } }));
        navigation.navigate('StartSessionScreen');
    }, [tableNumber, dispatch, navigation]);

    return (
        <AppBarLayout back title="Manually enter table number">
            <FlexWithMargin fill center p={32} gap={32}>
                <Text variant="headlineMedium">Enter table number</Text>
                <Flex inline wrap>
                    <TextInput
                        label="Table"
                        value={tableNumber}
                        onChangeText={text => setTableNumber(text)}
                        style={{
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                            marginBottom: 16,
                            width: '100%',
                        }}
                    />
                    <Button
                        mode="contained-tonal"
                        style={{ width: '100%' }}
                        onPress={handleContinue}
                    >
                        Continue
                    </Button>
                </Flex>
            </FlexWithMargin>
        </AppBarLayout>
    );
};

export default ManuallyEnterTableScreen;
