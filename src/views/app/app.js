import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Route, withRouter, Switch } from 'react-router-dom';

import { I18n } from 'react-i18next';
import { authActions, getAuth } from 'src/auth';
import { getProject } from 'src/projects';
import { notificationActions } from 'src/notification';
import Header from '../components/header';
import Footer from '../components/footer';
import RequireAuthRoute from '../components/require-auth-route';
import RequireUnauthRoute from '../components/require-unauth-route';
import SignInPage from '../pages/sign-in';
import TasksPage from '../pages/tasks';
import MePage from '../pages/me';
import CreateProjectPage from '../pages/create-project';

import NotFound from '../pages/not-found/';
import AboutPage from '../pages/about';
import SystemClosedPage from '../pages/system-closed';
import ReportsPage from '../pages/reports';
import AdminDashboard from '../pages/admin-dashboard';
import { createSelector } from 'reselect';
import 'react-select/dist/react-select.css';
import { appConfig } from 'src/config/app-config'
const App = ({auth, selectedProject, signOut, createProjectRedirect, isShowUpdateProfile, showSuccess}) => (
  <I18n ns='translations'>
    {
      (t, { i18n }) => (
    <div dir={t('lang-dir')}>
      <Header
        auth={auth}
        signOut={signOut}
        createProject={createProjectRedirect}
        isShowUpdateProfile={isShowUpdateProfile}
        onShowSuccess={showSuccess}
        selectedProject={selectedProject}
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
            <RequireAuthRoute authenticated={auth && auth.authenticated} path="/create-project" component={CreateProjectPage}/>
            // Uncommenting the following line causes the app to not allow users to login
            {/*<RequireAuthRoute authenticated={auth && auth.authenticated} exact path="/:projectUrl/" component={TasksPage}/>*/}
            <RequireAuthRoute authenticated={auth && auth.authenticated} path="/:projectUrl/task/:id" component={TasksPage}/>
            <RequireAuthRoute authenticated={auth && auth.authenticated} path="/:projectUrl/task/new-task" component={TasksPage}/>
            <RequireUnauthRoute authenticated={auth && auth.authenticated} path="/sign-in/" component={SignInPage}/>
            <RequireAuthRoute authenticated={auth && auth.authenticated} path="/me" component={MePage}/>
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
  getProject,
  (auth, selectedProject) => ({
    auth,
    selectedProject: selectedProject || {}
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
