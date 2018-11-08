import React, { Component } from 'react';
import { Map, List } from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Redirect } from 'react-router';
import { tasksActions} from 'src/tasks';
import { projectActions } from 'src/projects';

import { firebaseDb } from 'src/firebase';
import {CSVLink} from 'react-csv';

import {I18n} from 'react-i18next';
import './reports-page.css';

export class ReportsPage extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      users: Map(),
      usersWhoDidntBuy: Map(),
      query: [],
    }
  }

  static propTypes = {
    loadTasks: PropTypes.func.isRequired,
    tasks: PropTypes.instanceOf(List).isRequired,
    selectedProject: PropTypes.object,
    selectProjectFromUrl: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };

  componentWillMount() {
    const projectUrl = this.props.match.params.projectUrl;
    this.props.loadTasks(projectUrl);
    if (!this.props.selectedProject) {
      // Load the project
      this.props.selectProjectFromUrl();
    }

    firebaseDb.collection('users').get().then((querySnapshot) => {
      const contributors = {};
      const usersWhoDidntBuy = {};
      querySnapshot.forEach(function(doc) {
        let contributor = doc.data();
        contributors[doc.id] = contributor;
        if(contributor.didntBuy) {
          usersWhoDidntBuy[doc.id] = contributor;
        }
      });

      this.setState({
        users: Map(contributors),
        usersWhoDidntBuy: Map(usersWhoDidntBuy)
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.users !== this.state.users || prevProps.tasks !== this.props.tasks) {
      const collaborators = {};
      const query = [];

      this.props.tasks.forEach((task) =>  {
        if (task.assignee !=null) {
          collaborators[task.assignee.id] = task.id;
        }
      });

      let counter = 1;
      Object.entries(collaborators).forEach(entry => {
        const [collaboratorId, taskId] = entry;
        if (this.state.users.has(collaboratorId)) {
          const collaborator = this.state.users.get(collaboratorId);
          // Filter out the didntBuy people
          if(!collaborator.didntBuy) {
            query.push([counter++, collaborator.name, collaboratorId, collaborator.email, taskId])
          }
        }
      }
    );

      this.setState({query});
    }
  }

  isAdmin() {
    const projectUrl = this.props.match.params.projectUrl;
    return this.props.auth.role === 'admin' &&
      this.props.auth.adminProjects.includes(projectUrl);
  }

  render() {
    // 1: Get all users with at least one tasks that is assigned to them
    // 2: Get report based on a Tag (like in the main page)
    if (!this.isAdmin()) {
      return (
        <Redirect to="/"/>
      )
    }

    if(!this.props.selectedProject) {
      return <div></div>;
    }
    return (
      <I18n ns='translations'>
        {
          (t) => (
          <div className='reports-page'>
            <div>
              <h2>{this.props.selectedProject.name} ({this.props.selectedProject.url})</h2>
              <br/>
            </div>
            <h3> אנשים שלקחו על עצמם לפחות משימה אחת</h3>
            {this.state.query.length}

            <br/>
              <CSVLink data={this.state.query} >הורדת הדוח</CSVLink>

            <table className="report-table" >
              <thead>
              <tr className={`dir-${t('lang-float-reverse')}`}>
                <th>#</th>
                <th>Name</th>
                <th>Id</th>
                <th>Email</th>
                <th>Task</th>
              </tr>
              </thead>
                <tbody>
                {
                  this.state.query.map( (r) => (<tr key={r[0]}><th><a href={'/' + this.props.selectedProject.url + '/task/'+r[4]}>{r[4]}</a></th><th>{r[3]}</th><th>{r[2]}</th><th>{r[1]}</th><th>{r[0]}</th></tr>))
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
    tasks: state.tasks.list,
    auth: state.auth,
    selectedProject: state.projects.selectedProject
  }
};

const mapDispatchToProps = Object.assign(
  {},
  tasksActions,
  projectActions,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportsPage);
