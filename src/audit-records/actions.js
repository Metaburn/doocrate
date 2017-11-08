import { auditRecordList } from './audit-record-list'
import firebase from 'firebase/app';

import {
    CREATE_AUDIT_RECORD_SUCCESS,
    CREATE_AUDIT_RECORD_ERROR
} from './action-types';

export function createAuditRecordAction(auditRecord, cb = (a) => { }) {
    return dispatch => {
        return auditRecordList.push(auditRecord).then(cb)
            .catch(error => dispatch(createAuditRecordError(error)));
    };
}

export function createAuditRecord(auditRecord) {
    return auditRecordList.push(auditRecord)
}

export function createAuditRecordError(error) {
    console.warn(`audit record error: ${error}`)
    return {
        type: CREATE_AUDIT_RECORD_ERROR,
        payload: error
    };
}
