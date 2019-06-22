
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


// Get a given cookie from document.cookie
export function getCookie(cookieName) {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}


export function setCookie(name, value,years=10) {
  let date = new Date();
  date.setTime(date.getTime()+(years*365*24*60*60*1000));
  var expires = "expires="+date.toGMTString();
  document.cookie = name+"=" + value + "; " + expires+"; path=/";
}
