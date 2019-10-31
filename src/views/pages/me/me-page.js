import React, {Component} from "react";
import { NavLink } from "react-router-dom";

import { I18n } from "react-i18next";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import { notificationActions } from "../../../notification";
import {authActions} from "src/auth";
import { projectActions } from "src/projects";
import { userInterfaceActions } from "src/user-interface";
import { updateUserData } from "src/auth/auth";
import MyPortfolio from "../../molecules/myPortfolio/myPortfolio";
import {buildFilter, taskFilters, tasksActions} from "src/tasks";
import MyTasks from "../../molecules/myTasks/myTasks";
import {INCOMPLETE_TASKS} from "src/tasks";

import './me-page.css';

export class MePage extends Component {

  constructor() {
    super(...arguments);

    this.state = {
      showCreatedTasks: true,
      showAssignedTasks: true
    }
  }

  componentWillMount() {
    if(!this.props.selectedProject) {
      this.props.selectProjectFromUrl();
    }

    if(!this.props.tasks || this.props.tasks.size <= 0) {
      this.props.loadTasks(this.props.selectedProject.url, INCOMPLETE_TASKS);
    }
  }

  render() {
    const { auth, selectedProject} = this.props;
    const projectUrl = (selectedProject && selectedProject.url) ? selectedProject.url:
      auth.defaultProject;

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
                />

              <MyTasks
                buildFilter={buildFilter}
                taskFilters={taskFilters}
                tasks={this.props.tasks}
                auth={this.props.auth}
                onSelectTask={this.onSelectTask}
                onLabelClick={this.props.onLabelClick}
                projectUrl={projectUrl}
                setTour={(isShow, step) => {this.setTourAndGo(isShow, step)}}
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

  setTourAndGo = (isShow, step ) => {
    const { selectedProject, auth } = this.props;

    const projectUrl = (selectedProject && selectedProject.url) ? selectedProject.url:
      auth.defaultProject;
    this.props.history.push(`/${projectUrl}/task/1`);

    // Some bugs doesn't allow us to start the tour when navigating to another page
    // This prevent it

    setTimeout(() => {
      this.props.setTour(isShow, step);
    }, 1000);
    this.props.history.push(`/${this.props.projectUrl}/task/1`);

  };

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
  authActions,
  tasksActions,
  projectActions,
  {setTour: userInterfaceActions.setTour}
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MePage);
