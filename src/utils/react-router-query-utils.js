import { removeQueryParam } from './browser-utils';

export const removeQueryParamAndGo = (history, paramsToRemove, value) => {
  history.push({ search: removeQueryParam(paramsToRemove, value) });
};
