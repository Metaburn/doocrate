import React, { Component } from 'react';
import { Map, List } from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { Redirect } from 'react-router';
import { authActions, getAuth } from 'src/auth';
import { buildFilter, tasksActions, taskFilters } from 'src/tasks';
import classNames from 'classnames';
import LoaderUnicorn from '../../components/loader-unicorn/loader-unicorn';
import { firebaseDb } from 'src/firebase';
import {CSVLink, CSVDownload} from 'react-csv';

import './reports-page.css';

export class ReportsPage extends Component {
  constructor() {
    super(...arguments);    

    this.state = {
      users: Map(),
      query: []
    }
  }

  static propTypes = {
    loadTasks: PropTypes.func.isRequired,
    tasks: PropTypes.instanceOf(List).isRequired,
    auth: PropTypes.object.isRequired
  };

  componentWillMount() {    
    
    this.props.loadTasks();

    firebaseDb.collection('users').get().then((querySnapshot) => {
      const contributors = {}
      querySnapshot.forEach(function(doc) {
        contributors[doc.id] = doc.data();        
      });

      this.setState({users: Map(contributors)});
  });
  }

  componentWillReceiveProps(nextProps) {  
    
  }

  componentDidUpdate(prevProps, prevState) {    
    if (prevState.users != this.state.users || prevProps.tasks != this.props.tasks) {
      const collborators = {};
      const query = [["#", "name", "id", "email"]]

      this.props.tasks.forEach((t) =>  {
        if (t.assignee !=null)
          collborators[t.assignee.id] = true
      });

      let counter = 1;
      Object.keys(collborators).forEach(c => {
        if (this.state.users.has(c)) {
          const u = this.state.users.get(c);
          query.push([counter++, u.name, c, u.email])
        }
      }
    )
      
      this.setState({query});
    }
  }

  componentWillUnmount() {
  
  }

  filterTasks() {

  }

  onNewTaskAdded(task) {
  
  }

  createNewTask() {
  
  }

  isAdmin() {
    return this.props.auth.role == 'admin';
  }

  renderRow(row) {
    return ({
      
    })
  }



  render() {
    // 1: Get all users with at least one taks that is assigned to them
    // 2: Get report based on a Tag (like in the main page)    
    if (!this.isAdmin()) {
      return (
        <Redirect to="/"/>
      )
    }
    
    return (      
      <div>
          <h3> אנשים שלקחו על עצמם לפחות משימה אחת </h3>
          <CSVLink data={this.state.query} >הורדת הדוח</CSVLink>

        <table className="report-table" >
          {
            this.state.query.map( (r) => (<tr><th>{r[3]}</th><th>{r[2]}</th><th>{r[1]}</th><th>{r[0]}</th></tr>))
          } 
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
  }
}

const mapDispatchToProps = Object.assign(
  {},
  tasksActions
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportsPage);
