import React, { Component } from 'react';
import { Map, List } from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Redirect } from 'react-router';
import { tasksActions} from 'src/tasks';
import { firebaseDb } from 'src/firebase';
import {CSVLink} from 'react-csv';

import './reports-page.css';
import * as projectsActions from "../../../projects/actions";

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
    auth: PropTypes.object.isRequired
  };

  componentWillMount() {
    const projectUrl = projectsActions.getProjectFromUrl();
    this.props.loadTasks(projectUrl);

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
      const query = [["#", "name", "id", "email", "task"]];

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
    return this.props.auth.role === 'admin';
  }

  render() {
    // 1: Get all users with at least one tasks that is assigned to them
    // 2: Get report based on a Tag (like in the main page)
    if (!this.isAdmin()) {
      return (
        <Redirect to="/"/>
      )
    }

    return (
      <div className='reports-page'>
        {this.props.selectedProject ?
          <div>
            <h2>{this.props.selectedProject.name} ({this.props.selectedProject.url})</h2>
            <br/>
          </div>
          : ''
        }
        <h3> אנשים שלקחו על עצמם לפחות משימה אחת</h3>
        {this.state.query.length}

        <br/>
          <CSVLink data={this.state.query} >הורדת הדוח</CSVLink>

        <table className="report-table" >
              <tbody>
              {
                this.state.query.map( (r) => (<tr key={r[0]}><th><a href={'/task/'+r[4]}>{r[4]}</a></th><th>{r[3]}</th><th>{r[2]}</th><th>{r[1]}</th><th>{r[0]}</th></tr>))
              }
              </tbody>
          </table>
      </div>
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
  tasksActions
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportsPage);
