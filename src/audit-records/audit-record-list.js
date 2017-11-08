import { FirebaseList } from 'src/firebase';
import * as taskActions from './actions';
import { AuditRecord } from './audit-record';


export const auditRecordList = new FirebaseList({
    onAdd: () => { },
    onChange: () => { },
    onLoad: () => { },
    onRemove: () => { }
}, AuditRecord, "audit");