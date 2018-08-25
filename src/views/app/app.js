import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Route, withRouter, Switch } from 'react-router-dom';

import { I18n } from 'react-i18next';
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
import ReportsPage from '../pages/reports';
import { createSelector } from 'reselect';
import 'react-select/dist/react-select.css';

const App = ({auth, signOut, isShowUpdateProfile}) => (
  <I18n ns='translations'>
    {
      (t, { i18n }) => (
    <div dir={t('lang-dir')}>
      <Header
        auth={auth}
        signOut={signOut}
        isShowUpdateProfile={isShowUpdateProfile}
      />

      <main>
        <Switch>
          <RequireAuthRoute authenticated={auth && auth.authenticated} exact path="/" component={TasksPage}/>
          <RequireAuthRoute authenticated={auth && auth.authenticated} path="/task/:id" component={TasksPage} />
          <RequireUnauthRoute authenticated={auth && auth.authenticated} path="/sign-in" component={SignInPage}/>
          <RequireAuthRoute authenticated={auth && auth.authenticated} path="/me" component={MePage} />
          <RequireAuthRoute authenticated={auth && auth.authenticated} path="/reports" component={ReportsPage}/>
          <Route authenticated={auth && auth.authenticated} path="/about" component={AboutPage}/>
          <Route component={NotFound}/>
        </Switch>
      </main>
      <Footer />
    </div>
      )}
  </I18n>
);

App.propTypes = {
  auth: PropTypes.object.isRequired,
  signOut: PropTypes.func.isRequired,
  isShowUpdateProfile: PropTypes.func.isRequired
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
  signOut: authActions.signOut,
  isShowUpdateProfile: authActions.isShowUpdateProfile
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
