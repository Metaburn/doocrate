import React, { Component } from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { projectActions } from 'src/projects';

import { I18n } from 'react-i18next';
import { getAuth } from 'src/auth';

import './projects-page.css';

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
    auth: PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.props.loadProjects();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.projects === this.props.projects) {
      return;
    }

    const projectsArray = [];

    let counter = 1;
    this.props.projects.forEach(project => {
      projectsArray.push([counter++, project.name, project.url]);
    });

    this.setState({ projects: projectsArray });
  }

  isAdmin() {
    return this.props.auth.role === 'admin';
  }

  render() {
    return (
      <I18n ns="translations">
        {t => (
          <div className="projects-page">
            <h1>{t('projects.header')}</h1>
            <br />

            <table className="report-table">
              <thead>
                <tr className={`dir-${t('lang-float-reverse')}`}>
                  <th>#</th>
                  <th>{t('projects.name')}</th>
                </tr>
              </thead>
              <tbody>
                {this.state.projects.map(project => (
                  <tr
                    key={project[0]}
                    className={`dir-${t('lang-float-reverse')}`}
                  >
                    <th>{project[0]}</th>
                    <th>
                      <a href={'/' + project[2] + '/task/1?complete=false'}>
                        {project[1]}
                      </a>
                    </th>
                  </tr>
                ))}
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
const mapStateToProps = state => {
  return {
    projects: state.projects.list,
    auth: getAuth(state),
  };
};

const mapDispatchToProps = Object.assign({}, projectActions);

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsPage);
