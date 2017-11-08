import { List, Record } from 'immutable';

import {
    CREATE_AUDIT_RECORD_SUCESS,
    CREATE_AUDIT_RECORD_ERROR
} from './action-types';

export const AuditRecordState = new Record({
});

export function auditRecordsReducer(state = new AuditRecordState(), { payload, type }) {
    switch (type) {
        default:
            return state;
    }
}
