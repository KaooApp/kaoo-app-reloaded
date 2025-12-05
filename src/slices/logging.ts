import type { PayloadAction } from '@reduxjs/toolkit';

import uuid from 'react-native-uuid';

import type { LoggingState } from '@/types/logging';

import type { LogProps } from '@/utils/root-logging';

import { createSlice } from '@reduxjs/toolkit';

const maximumLogsPerType = 100;

const initialState: LoggingState = {
    logs: [],
};

const loggingSlice = createSlice({
    name: 'logging',
    initialState,
    reducers: {
        appendLog: (state, action: PayloadAction<Omit<LogProps, 'uuid'>>) => {
            // add log infront of the array
            state.logs.unshift({
                ...action.payload,
                timestamp: Date.now(),
                uuid: uuid.v4(),
            });

            const logsOfType = state.logs.filter(
                log => log.level.severity === action.payload.level.severity,
            ).length;

            // remove the last log in the array
            if (logsOfType > maximumLogsPerType) {
                state.logs.pop();
            }
        },
        appendLogWithStacktrace: (
            state,
            action: PayloadAction<
                Omit<LogProps, 'uuid'> & { stacktrace: string }
            >,
        ) => {
            // add log infront of the array
            state.logs.unshift({
                ...action.payload,
                timestamp: Date.now(),
                stacktrace: action.payload.stacktrace,
                uuid: uuid.v4(),
            });

            const logsOfType = state.logs.filter(
                log => log.level.severity === action.payload.level.severity,
            ).length;

            // remove the last log in the array
            if (logsOfType > maximumLogsPerType) {
                state.logs.pop();
            }
        },
        clearLogs: state => {
            // eslint-disable-next-line no-param-reassign
            state.logs = [];
        },
    },
});

export const { appendLog, appendLogWithStacktrace, clearLogs } =
    loggingSlice.actions;

export const { reducer: LoggingReducer } = loggingSlice;

export default loggingSlice.reducer;
