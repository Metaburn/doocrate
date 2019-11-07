import React, { Component } from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { projectActions } from 'src/projects';

import './projects-page.css';
import {I18n} from 'react-i18next';
import { getCookie } from 'src/utils/browser-utils';
import {getUrlSearchParams} from "../../../utils/browser-utils";

export class ProjectsPage extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      projects: [],
    };
  }

  static propTypes = {
    loadProjects: PropTypes.func.isRequired,
    projects: PropTypes.instanceOf(List).isRequired,
    auth: PropTypes.object.isRequired
  };

  componentWillMount() {
    // Check if need to redirect to the project the user got from when he first received the link
    this.checkIfRedirectByProjectCookie();
    this.props.loadProjects();
  }

  // A user may have receive a link with a redirect request - We do that only once
  checkIfRedirectByProjectCookie() {
    const params = getUrlSearchParams();
    const isShowAllProjects = params['show'];
    // Dont redirect when a user presses on the show all projects
    if(isShowAllProjects) {
      return;
    }
    const project = getCookie('project');
    if (project && project !== "[object Object]") {
      this.props.history.push('/'+ project +'/task/1');
    }
    // Temporary fix for those who reached object object
    else if (project && (project === "[object Object]" || project === "null")) {
      this.props.history.push('/burnerot19/task/1');
    }

    // Redirect user to default project
    if(this.props.auth.defaultProject) {
      this.props.history.push('/'+ this.props.auth.defaultProject +'/task/1');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.projects === this.props.projects) {
      return;
    }

    const projectsArray = [];

    let counter = 1;
    this.props.projects.forEach((project) => {
      projectsArray.push([counter++, project.name, project.url])
    });

    this.setState({projects: projectsArray});
  }

  isAdmin() {
    return this.props.auth.role === 'admin';
  }

  render() {
    return (
      <I18n ns='translations'>
        {
          (t) => (
          <div className='projects-page'>
            <h1>{t('projects.header')}</h1>
            <br/>

            <table className='report-table'>
              <thead>
              <tr className={`dir-${t('lang-float-reverse')}`}>
                <th>#</th>
                <th>{t('projects.name')}</th>
              </tr>
              </thead>
                <tbody>
                  {
                    this.state.projects.map( (project) => (
                      <tr key={project[0]} className={`dir-${t('lang-float-reverse')}`}>
                        <th>{project[0]}</th>
                        <th>
                          <a href={'/'+project[2]+'/task/1?complete=false'}>{project[1]}</a>
                        </th>
                      </tr>))
                  }
                  </tbody>
            </table>
          </div>
          )}
      </I18n>
    );
  }
}


//=====================================
//  CONNECT
//-------------------------------------
const mapStateToProps = (state) => {
  return {
    projects: state.projects.list,
    auth: state.auth,
  }
};

const mapDispatchToProps = Object.assign(
  {},
  projectActions
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectsPage);
