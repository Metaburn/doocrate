import { Map } from 'immutable';

import {
    CREATE_LABEL,LOAD_LABEL,
    REMOVE_LABEL, UPDATE_LABEL
} from './action-types';


export const LabelsState = new Map({});

export function labelsReducer(state = new Map({}), {payload, type}) {
  switch (type) {
    case CREATE_LABEL: case UPDATE_LABEL:
        return  state.set(payload.get('name'), payload);
    case LOAD_LABEL: return state;
    case REMOVE_LABEL: return state;

    default:
      return state;
  }
}
