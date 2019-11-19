import { labelList } from './label-list';
import {
  CREATE_LABEL,
  LOAD_LABEL,
  REMOVE_LABEL,
  UPDATE_LABEL,
} from './action-types';

export const loadLabels = projectId => {
  return (dispatch, getState) => {
    window.ll = labelList;
    labelList.rootPath = 'projects';
    labelList.rootDocId = projectId;
    labelList.path = `labels`;
    labelList.subscribe(dispatch);
  };
};

export function createLabel(label) {
  return {
    type: CREATE_LABEL,
    payload: label,
  };
}

export function loadLabel(label) {
  return {
    type: LOAD_LABEL,
    payload: label,
  };
}

export function removeLabel(label) {
  return {
    type: REMOVE_LABEL,
    payload: label,
  };
}

export function updateLabel(label) {
  return {
    type: UPDATE_LABEL,
    payload: label,
  };
}
