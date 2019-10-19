
// Since not all browser support URLSearchParams we implement it here
export function getUrlSearchParams(locationSearch = window.location.search) {
  return locationSearch.substr(1).split('&').reduce(function (q, query) {
    const chunks = query.split('=');
    const key = chunks[0];
    if(!chunks[1]) {
      return {};
    }
    const values = chunks[1].split(','); //We want to support value=123,555
    const value = (values.length > 1 ) ? values : values[0];
    return (q[key] = value, q);
  }, {});
}

// Takes the { param=value, param2=value} and export it as a string to be used as a query param
export function urlSearchParamsToString(paramObject) {
  let result = '';
  if(!paramObject) {
    return '';
  }
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

// Array of params [{name:name,value:value}] to set in query url
export function setQueryParams(params) {
  const result = new URLSearchParams(window.location.search);
  for (const param of params){
    result.set(param.name, param.value);
  }

  return result.toString();
}

// Set a given name and value in query url
export function setQueryParam(name, value) {
  const result = new URLSearchParams(window.location.search);
  result.set(name, value);
  return result.toString();
}

/*
 This function handles replacing / concatting params to location
 Can receive complete for example will remove complete
 value - Optional value if it's a multi value like labels=label1,label2 then value=label2 can remove that label
 Apparently URLSearchParams doesn't handle delete for a single value
*/
export function removeQueryParam(paramsToRemove, value) {
  let currentQueryParams = getUrlSearchParams();

  if(!currentQueryParams) { return {}}
  paramsToRemove.forEach( param => {
    // Handle case of label=['label1','label2']

    if(Array.isArray(currentQueryParams[param]) && value) {
      currentQueryParams[param] = currentQueryParams[param].filter((val) => { return val !== value });
    }else {
      delete currentQueryParams[param];
    }
  });
  return urlSearchParamsToString(currentQueryParams);
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
