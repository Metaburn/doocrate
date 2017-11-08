import { Record } from 'immutable';

export const AuditRecord = new Record({
    id: null,
    action: null,
    performer: null,
    entityType: null,
    entitySnapshot: null
});
