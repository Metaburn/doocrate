import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {BrowserRouter as Router, Route, withRouter, Switch } from 'react-router-dom';

import { authActions, getAuth } from 'src/auth';
import Header from '../components/header';
import Footer from '../components/footer';
import RequireAuthRoute from '../components/require-auth-route';
import RequireUnauthRoute from '../components/require-unauth-route';
import SignInPage from '../pages/sign-in';
import TasksPage from '../pages/tasks';
import MePage from '../pages/me';
import NotFound from '../pages/not-found/';
import AboutPage from '../pages/about';
import { createSelector } from 'reselect';
import 'react-select/dist/react-select.css';

const App = ({auth, signOut}) => (
  <div>
    <Header
      auth={auth}
      signOut={signOut}
    />

    <main>    
      <Switch>
        <RequireAuthRoute authenticated={auth && auth.authenticated} exact path="/" component={TasksPage}/>      
        <RequireAuthRoute authenticated={auth && auth.authenticated} path="/task/:id" component={TasksPage} />
        <RequireUnauthRoute authenticated={auth && auth.authenticated} path="/sign-in" component={SignInPage}/>
        <RequireAuthRoute authenticated={auth && auth.authenticated} path="/me" component={MePage} />
        <Route authenticated={auth && auth.authenticated} path="/about" component={AboutPage}/>
        <Route component={NotFound}/>
      </Switch>
    </main>
    <Footer />
  </div>
);

App.propTypes = {
  auth: PropTypes.object.isRequired,
  signOut: PropTypes.func.isRequired
};


//=====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = createSelector(
  getAuth,
  (auth) => ({
    auth
  })
);


const mapDispatchToProps = {
  signOut: authActions.signOut
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
