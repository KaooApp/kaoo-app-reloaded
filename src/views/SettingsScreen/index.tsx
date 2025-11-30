import { Button, Text } from 'react-native-paper';
import type { FC } from 'react';

import AppBarLayout from '@/components/layout/AppBarLayout';
import { resetState } from '@/slices/persisted';
import { resetSettings } from '@/slices/settings';
import { useAppDispatch, useAppSelector } from '@/store';

const SettingsScreen: FC = () => {
    const dispatch = useAppDispatch();

    const settings = useAppSelector(state => state.settings);

    return (
        <AppBarLayout title="Settings" back>
            <Text>SettingsScreen</Text>
            <Button
                onPress={() => {
                    dispatch(resetState());
                }}
            >
                Reset persisted config
            </Button>
            <Button
                onPress={() => {
                    dispatch(resetSettings());
                }}
            >
                Reset settings
            </Button>
            <Text>{JSON.stringify(settings, null, 4)}</Text>
        </AppBarLayout>
    );
};

export default SettingsScreen;
