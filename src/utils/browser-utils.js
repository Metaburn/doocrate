
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
