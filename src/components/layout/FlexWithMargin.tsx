import type { FlexProps } from 'react-native-flex-layout';
import { Flex } from 'react-native-flex-layout';
import type { FC } from 'react';

import { modeAppbarHeight } from '@/components/layout/AppBarLayout';

export interface FlexWithMarginProps extends FlexProps {
    gap?: number;
}

const FlexWithMargin: FC<FlexWithMarginProps> = ({ gap, ...props }) => (
    <Flex
        {...props}
        mb={modeAppbarHeight.medium}
        style={{ gap, ...props.style }}
    />
);

export default FlexWithMargin;
