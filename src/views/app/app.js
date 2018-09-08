import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Route, withRouter, Switch } from 'react-router-dom';

import { I18n } from 'react-i18next';
import { authActions, getAuth } from 'src/auth';
import { notificationActions } from 'src/notification';
import Header from '../components/header';
import Footer from '../components/footer';
import RequireAuthRoute from '../components/require-auth-route';
import RequireUnauthRoute from '../components/require-unauth-route';
import SignInPage from '../pages/sign-in';
import TasksPage from '../pages/tasks';
import MePage from '../pages/me';
import NotFound from '../pages/not-found/';
import AboutPage from '../pages/about';
import SystemClosedPage from '../pages/system-closed';
import ReportsPage from '../pages/reports';
import AdminDashboard from '../pages/admin-dashboard';
import { createSelector } from 'reselect';
import 'react-select/dist/react-select.css';
import { appConfig } from 'src/config/app-config'
const App = ({auth, signOut, isShowUpdateProfile, showSuccess}) => (
  <I18n ns='translations'>
    {
      (t, { i18n }) => (
    <div dir={t('lang-dir')}>
      <Header
        auth={auth}
        signOut={signOut}
        isShowUpdateProfile={isShowUpdateProfile}
        onShowSuccess={showSuccess}
      />

      <main>
        {appConfig.isSystemClosed ?
          <Switch>
            <Route authenticated={auth && auth.authenticated} exact path="/" component={SystemClosedPage}/>
            <Route authenticated={auth && auth.authenticated} path="/about" component={AboutPage}/>
            <RequireAuthRoute authenticated={auth && auth.authenticated} path="/reports" component={ReportsPage}/>
            <Route component={NotFound}/>
          </Switch> :

          <Switch>
            <RequireAuthRoute authenticated={auth && auth.authenticated} exact path="/" component={TasksPage}/>
            <RequireAuthRoute authenticated={auth && auth.authenticated} path="/task/:id" component={TasksPage}/>
            <RequireAuthRoute authenticated={auth && auth.authenticated} path="/task/new-task" component={TasksPage}/>
            <RequireAuthRoute authenticated={auth && auth.authenticated} path="/me" component={MePage}/>
            <RequireUnauthRoute authenticated={auth && auth.authenticated} path="/sign-in" component={SignInPage}/>
            <Route authenticated={auth && auth.authenticated} path="/about" component={AboutPage}/>
            <RequireAuthRoute authenticated={auth && auth.authenticated && auth.role === "admin" } path="/reports" component={ReportsPage}/>
            <RequireAuthRoute authenticated={auth && auth.authenticated && auth.role === "admin" } path="/admin-dashboard" component={AdminDashboard}/>
            <Route component={NotFound}/>
          </Switch>
        }
      </main>
      <Footer />
    </div>
      )}
  </I18n>
);

App.propTypes = {
  auth: PropTypes.object.isRequired,
  signOut: PropTypes.func.isRequired,
  isShowUpdateProfile: PropTypes.func.isRequired,
  showSuccess: PropTypes.func.isRequired
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
  isShowUpdateProfile: authActions.isShowUpdateProfile,
  showSuccess: notificationActions.showSuccess
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
