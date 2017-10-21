import { Map, Record } from 'immutable';
import { SIGN_OUT_SUCCESS } from 'src/auth/action-types';

import {
    CREATE_LABEL,LOAD_LABEL,
    REMOVE_LABEL, UPDATE_LABEL
} from './action-types';


export const LabelsState = new Map({});


export function labelsReducer(state = new Map({}), {payload, type}) {
    console.log(state);    
    
  switch (type) {
    case CREATE_LABEL: 
        if (payload) console.log(payload.toJS());
        console.log(state.toJS());
        return  state.set(payload.get('name'), payload);
    break;
    case LOAD_LABEL: return state; break;
    case REMOVE_LABEL: return state; break; 
    case UPDATE_LABEL: return state; break;
    
    default:
      return state;
  }
}
