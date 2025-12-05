import { Platform, View } from 'react-native';

import { Appbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { FC, PropsWithChildren } from 'react';

import { useNavigation, usePreventRemove } from '@react-navigation/native';

export interface AppBarLayoutProps extends PropsWithChildren {
    title?: string;
    back?: boolean | (() => void);
    settings?: boolean;
    disableSafeArea?: boolean;
    debug?: boolean;
    // If the layout component is used in a screen that is rendered in a tab navigator
    hasTabs?: boolean;
    action?: {
        icon: string;
        onPress: () => void;
    };
}

export { modeAppbarHeight } from 'react-native-paper/src/components/Appbar/utils';

const AppBarLayout: FC<AppBarLayoutProps> = ({
    children,
    title,
    back,
    settings,
    disableSafeArea,
    debug,
    hasTabs,
    action,
}) => {
    const insets = useSafeAreaInsets();

    const navigation = useNavigation();

    const actionIsLeft = Platform.select({
        default: false,
        ios: true,
    });

    const backEnabled =
        (back === true && navigation.canGoBack()) || typeof back === 'function';
    const backAction = !backEnabled
        ? undefined
        : typeof back === 'function'
          ? back
          : () => {
                if (navigation.canGoBack()) {
                    navigation.goBack();
                }
            };

    usePreventRemove(!backEnabled, () => {});

    const showDebugAreas = __DEV__ && debug;

    return (
        <>
            <Appbar.Header>
                {backEnabled ? (
                    <Appbar.BackAction onPress={backAction} />
                ) : null}
                {action && actionIsLeft ? <Appbar.Action {...action} /> : null}
                <Appbar.Content title={title} />
                {action && !actionIsLeft ? <Appbar.Action {...action} /> : null}
                {settings ? (
                    <Appbar.Action
                        icon="cog"
                        onPress={() => {
                            navigation.navigate('SettingsScreen');
                        }}
                    />
                ) : null}
            </Appbar.Header>
            {disableSafeArea ? (
                children
            ) : (
                <View
                    style={{
                        flex: 1,
                        // paddingTop: insets.top,
                        paddingBottom: hasTabs ? 0 : insets.bottom,
                        paddingLeft: insets.left,
                        paddingRight: insets.right,
                        backgroundColor: showDebugAreas
                            ? 'rgba(255,0,0,0.1)'
                            : undefined,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: showDebugAreas
                                ? 'rgba(0,255,0,0.1)'
                                : undefined,
                        }}
                    >
                        {children}
                    </View>
                </View>
            )}
        </>
    );
};

export default AppBarLayout;
