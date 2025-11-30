import { Appbar } from 'react-native-paper';
import type { FC, PropsWithChildren } from 'react';

import { useNavigation } from '@react-navigation/native';

export interface AppBarLayoutProps extends PropsWithChildren {
    title: string;
    back?: boolean;
    settings?: boolean;
}

export { modeAppbarHeight } from 'react-native-paper/src/components/Appbar/utils';

const AppBarLayout: FC<AppBarLayoutProps> = ({
    children,
    title,
    back,
    settings,
}) => {
    const navigation = useNavigation();

    return (
        <>
            <Appbar.Header>
                {back ? (
                    <Appbar.BackAction
                        onPress={() => {
                            if (navigation.canGoBack()) {
                                navigation.goBack();
                            }
                        }}
                    />
                ) : null}
                <Appbar.Content title={title} />
                {settings ? (
                    <Appbar.Action
                        icon="cog"
                        onPress={() => {
                            navigation.navigate('SettingsScreen');
                        }}
                    />
                ) : null}
            </Appbar.Header>
            {children}
        </>
    );
};

export default AppBarLayout;
