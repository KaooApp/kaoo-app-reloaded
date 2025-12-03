import type { ColorValue } from 'react-native';
import { Flex } from 'react-native-flex-layout';
import {
    Divider,
    Surface,
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';
import type { FC, PropsWithChildren } from 'react';

interface SettingsItemWithText {
    title: string;
    subtitle?: string;
    color?: ColorValue;
    onPress?: () => void;
}

interface SettingsItemWithoutText {
    title: false;
    subtitle?: never;
    color?: never;
    onPress?: never;
}

export type SettingsItemProps = PropsWithChildren &
    (SettingsItemWithText | SettingsItemWithoutText);

const SettingsItem: FC<SettingsItemProps> = ({
    title,
    color,
    children,
    onPress,
    subtitle,
}) => {
    const theme = useTheme();

    return (
        <TouchableRipple onPress={onPress}>
            <Surface
                style={{
                    marginVertical: 4,
                    minHeight: 48,
                    borderRadius: 16,
                    backgroundColor: theme.colors.background,
                }}
                mode="flat"
            >
                {title === false ? (
                    children
                ) : (
                    <>
                        <Flex
                            fill
                            inline
                            items="center"
                            justify="between"
                            style={{ padding: 8 }}
                        >
                            <Text
                                variant="bodyLarge"
                                style={{ color: color || 'initial' }}
                            >
                                {title}
                            </Text>
                            {children}
                        </Flex>
                        {subtitle ? (
                            <>
                                <Divider />
                                <Flex
                                    fill
                                    inline
                                    items="center"
                                    justify="between"
                                    style={{ padding: 8 }}
                                >
                                    <Text variant="labelSmall">{subtitle}</Text>
                                </Flex>
                            </>
                        ) : null}
                    </>
                )}
            </Surface>
        </TouchableRipple>
    );
};

export default SettingsItem;
