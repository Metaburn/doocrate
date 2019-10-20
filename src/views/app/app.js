import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Route, withRouter, Switch } from 'react-router-dom';

import { I18n } from 'react-i18next';
import { authActions, getAuth } from 'src/auth';
import { getProject } from 'src/projects';
import Header from '../components/header';
import BottomNavBar from '../components/bottom-nav-bar';
import RequireAuthRoute from '../components/require-auth-route';
import RequireUnauthRoute from '../components/require-unauth-route';
import SignInPage from '../pages/sign-in';
import MagicLink from '../pages/magic-link';
import TasksPage from '../pages/tasks';
import MePage from '../pages/me';
import CreateProjectPage from '../pages/set-project';

import NotFound from '../pages/not-found/';
import AboutPage from '../pages/about';
import SystemClosedPage from '../pages/system-closed';
import ReportsPage from '../pages/reports';
import ProjectsPage from '../pages/projects';
import AdminDashboard from '../pages/admin-dashboard';
import { createSelector } from 'reselect';
import 'url-search-params-polyfill';
import { appConfig } from 'src/config/app-config';

const App = ({auth, selectedProject, signOut, createProjectRedirect, isShowUpdateProfile}) => (
  <I18n ns='translations'>
    {
      (t, { i18n }) => (
    <div dir={t('lang-dir')}>
      <Header
        auth={auth}
        signOut={signOut}
        createProject={createProjectRedirect}
        isShowUpdateProfile={isShowUpdateProfile}
        selectedProject={selectedProject}
      />

      <main>
        {appConfig.isSystemClosed ?
          <Switch>
            <Route authenticated={auth && auth.authenticated} exact path="/" component={SystemClosedPage}/>
            <Route authenticated={auth && auth.authenticated} path="/about" component={AboutPage}/>
            <RequireAuthRoute authenticated={auth && auth.authenticated && auth.role === "admin" } path="/:projectUrl/reports" component={ReportsPage}/>
            <Route component={NotFound}/>
          </Switch> :

          <Switch>
            <RequireAuthRoute authenticated={auth && auth.authenticated} exact path="/" component={ProjectsPage}/>
            <RequireAuthRoute authenticated={auth && auth.authenticated} path="/create-project" component={CreateProjectPage}/>
            <RequireUnauthRoute authenticated={auth && auth.authenticated} exact path="/sign-in/" component={SignInPage}/>
            <RequireUnauthRoute authenticated={auth && auth.authenticated} exact path="/magic-link" component={MagicLink}/>
            <Route authenticated={auth && auth.authenticated} path="/projects" component={ProjectsPage}/>
            <RequireAuthRoute authenticated={auth && auth.authenticated} path="/me" component={MePage}/>
            <Route authenticated={auth && auth.authenticated} path="/about" component={AboutPage}/>
            <RequireAuthRoute authenticated={auth && auth.authenticated && auth.role === "admin" } exact path="/admin/dashboard" component={AdminDashboard}/>
            {
              /* The hierarchy here is important - /:projectUrl/task/:id should come before /:projectUrl
             * Otherwise React router doesn't parse task id properly */
            }
            <RequireAuthRoute authenticated={auth && auth.authenticated} path="/:projectUrl/task/:id" component={TasksPage}/>
            <RequireAuthRoute authenticated={auth && auth.authenticated} path="/:projectUrl/task/new-task" component={TasksPage}/>
            <RequireAuthRoute authenticated={auth && auth.authenticated} path="/:projectUrl/edit" component={CreateProjectPage}/>
            <RequireAuthRoute authenticated={auth && auth.authenticated && auth.role === "admin" } path="/:projectUrl/reports" component={ReportsPage}/>
            <RequireAuthRoute authenticated={auth && auth.authenticated} path="/:projectUrl/" component={TasksPage} />

            <Route component={NotFound}/>
          </Switch>
        }
      </main>
      <BottomNavBar auth={auth}/>
    </div>
      )}
  </I18n>
);

App.propTypes = {
  auth: PropTypes.object.isRequired,
  signOut: PropTypes.func.isRequired,
  isShowUpdateProfile: PropTypes.func.isRequired,
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
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
