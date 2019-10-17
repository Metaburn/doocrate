import { removeQueryParam } from './browser-utils';

export const removeQueryParamAndGo = (history, paramsToRemove) => {
  history.push({pathname: '/home', search: removeQueryParam(paramsToRemove)});
};
