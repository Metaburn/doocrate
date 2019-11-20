import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getProjectFromUrl } from '../../../projects/actions';

const RequireAuthRoute = ({ component: Component, authenticated, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      return authenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/sign-in/',
            search: 'project=' + (getProjectFromUrl() || ''),
            state: { from: props.location },
          }}
        />
      );
    }}
  />
);

export default RequireAuthRoute;
