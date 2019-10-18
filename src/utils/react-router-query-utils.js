import { removeQueryParam } from './browser-utils';

export const removeQueryParamAndGo = (history, paramsToRemove, value) => {
  history.push({pathname: '/home', search: removeQueryParam(paramsToRemove, value)});
};
