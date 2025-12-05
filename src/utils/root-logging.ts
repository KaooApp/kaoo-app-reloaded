import { InteractionManager } from 'react-native';

import type {
    configLoggerType,
    transportFunctionType,
} from 'react-native-logs';
import { consoleTransport, logger } from 'react-native-logs';
import type { ConsoleTransportOptions } from 'react-native-logs/src/transports/consoleTransport';

import moment from 'moment';

let pushMessageFunction: transportFunctionType<ConsoleTransportOptions> | null =
    null;

export type LogProps = Parameters<
    transportFunctionType<ConsoleTransportOptions>
>[0] & {
    uuid: string;
};

export interface ExtendedLogProps extends LogProps {
    timestamp: number;
    stacktrace?: string;
}

export const setPushMessageFunction = (
    func: transportFunctionType<ConsoleTransportOptions>,
): void => {
    pushMessageFunction = func;
};

const customTransport: transportFunctionType<ConsoleTransportOptions> = (
    ...args
) => {
    if (pushMessageFunction) pushMessageFunction(...args);
};

const config: configLoggerType<
    transportFunctionType<object> | transportFunctionType<object>[],
    string
> = {
    transport: [consoleTransport, customTransport],
    severity: 'info',
    dateFormat: date => moment(date).format('DD.MM.YYYY HH:mm:ss.SSS | '),
    async: true,
    asyncFunc: InteractionManager.runAfterInteractions,
};

const rootLogging = logger.createLogger(config);

export default rootLogging;
