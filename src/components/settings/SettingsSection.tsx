import { Box } from 'react-native-flex-layout';
import { Surface, Text } from 'react-native-paper';
import type { FC, PropsWithChildren } from 'react';

export interface SettingsSectionProps extends PropsWithChildren {
    title: string;
}

const SettingsSection: FC<SettingsSectionProps> = ({ title, children }) => (
    <Surface
        style={{
            marginHorizontal: 12,
            marginVertical: 4,
            padding: 16,
            minHeight: 48,
            borderRadius: 24,
        }}
        mode="flat"
        elevation={2}
    >
        <Box mb={8}>
            <Text variant="titleLarge">{title}</Text>
        </Box>
        {children}
    </Surface>
);

export default SettingsSection;
