import { InteractionManager } from 'react-native';

import type {
    configLoggerType,
    transportFunctionType,
} from 'react-native-logs';
import { consoleTransport, logger } from 'react-native-logs';

import moment from 'moment';

const config: configLoggerType<
    transportFunctionType<object> | transportFunctionType<object>[],
    string
> = {
    transport: [consoleTransport],
    severity: __DEV__ ? 'info' : 'warn',
    dateFormat: date => moment(date).format('DD.MM.YYYY HH:mm:ss.SSS | '),
    async: true,
    asyncFunc: InteractionManager.runAfterInteractions,
};

const rootLogging = logger.createLogger(config);

export default rootLogging;
