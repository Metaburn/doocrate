
// Since not all browser support URLSearchParams we implement it here
export function getUrlSearchParams(locationSearch = window.location.search) {
    var queryParams = locationSearch.substr(1).split('&').reduce(function (q, query) {
    var chunks = query.split('=');
    var key = chunks[0];
    var value = chunks[1];
    return (q[key] = value, q);
  }, {});
  return queryParams;
}

// TODO: This should be filled with some transpiler to support older browsers
// Takes the { param=value, param2=value} and export it as a string to be used as a query param
export function urlSearchParamsToString(paramObject) {
  let result = '';
  Object.keys(paramObject).forEach(e => {
    if (e == null || e === '') return;
    result+=`${e}=${paramObject[e]}&`;
  });

  // Remove the last '&' char
  if (result.length > 0) {
    result = result.slice(0, result.length-1);
  }

  return result
}
