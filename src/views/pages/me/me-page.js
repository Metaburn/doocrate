import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';

import { I18n } from 'react-i18next';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import { notificationActions } from "../../../notification";
import {authActions} from "../../../auth";
import { updateUserData } from "src/auth/auth";
import MyPortfolio from "../../molecules/myPortfolio/myPortfolio";

import './me-page.css';
import {buildFilter, taskFilters} from "src/tasks";
import MyTasks from "../../molecules/myTasks/myTasks";

export class MePage extends Component {

  constructor() {
    super(...arguments);

    this.state = {
      showCreatedTasks: true,
      showAssignedTasks: true
    }
  }

  render() {
    const auth = this.props.auth;

    return (
      <I18n ns='translations'>
        {
          (t, {i18n}) => (
            <div className='me notranslate'>
              <MyPortfolio
                auth={this.props.auth}
                showSuccess={this.props.showSuccess}
                isShowUpdateProfile={this.props.isShowUpdateProfile}
                updateUserData={(userData) => this.updateUserData(i18n, userData)}
                i18n={i18n}/>

              <MyTasks
                buildFilter={buildFilter}
                taskFilters={taskFilters}
                tasks={this.props.tasks}
                selectedProject={this.props.selectedProject}
                auth={this.props.auth}
                onSelectTask={this.onSelectTask}
                onLabelClick={this.props.onLabelClick}
                i18n={i18n}
              />


              {auth && auth.role !== 'user' ?
                <div className={'projects-you-manage'}>{t('my-space.projects-you-manage')}:</div>
                :
                ''
              }
              { this.renderAdminProjects(t)}
            </div>
          )}
      </I18n>
    )
  }

  updateUserData = (i18n, newData) => {
    updateUserData(newData).then( () => {
      this.props.showSuccess(i18n.t('my-space.updated-successfully'));
    })
  };

  renderAdminProjects = (t) => {
    const { auth } = this.props;

    if (!auth || !auth.adminProjects || auth.adminProjects.size <= 0)
      return;

    return (
      <div className={'projects'}>
        {
          auth.adminProjects.map(project => {
            return (
              <div className={'project'} key={project}>
                <span>{project}</span>
                <span><NavLink to={`/${project}/reports`}>{t('my-space.project-report')}</NavLink></span>
                <span><NavLink to={`/${project}/edit`}>{t('my-space.edit-project')}</NavLink></span>
              </div>
            )
          })
        }
      </div>
    )
  };

  onSelectTask = (task) =>{
    this.props.history.push('/' + this.props.selectedProject.url + '/task/' + task.id);
  }
}

MePage.propTypes = {
  auth: PropTypes.object.isRequired,
  showSuccess: PropTypes.func.isRequired,
  isShowUpdateProfile: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    tasks: state.tasks.list,
    selectedProject: state.projects.selectedProject,
  }
};


const mapDispatchToProps = Object.assign(
  {},
  notificationActions,
  authActions
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MePage);
