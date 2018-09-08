import React, { Component } from 'react';
import { Map, List } from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { Redirect } from 'react-router';
import { firebaseDb } from 'src/firebase';

import './admin-dashboard.css';
import Button from "../../components/button/button";
import i18n from "../../../i18n";
import {notificationActions} from "../../../notification";

export class AdminDashboard extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      users: Map(),
      query: [],
      isButtonsUnlocked: false
    };
    this.setAllUsersToHaveCreateTaskAssignPermissions = this.setAllUsersToHaveCreateTaskAssignPermissions.bind(this);
    this.unlockDashboard = this.unlockDashboard.bind(this);
  }

  static propTypes = {
    auth: PropTypes.object.isRequired
  };

  componentWillMount() {

    firebaseDb.collection('users').get().then((querySnapshot) => {
      const users = {};
      querySnapshot.forEach(function(doc) {
        users[doc.id] = doc.data();
      });

      this.setState({users: Map(users)});
  });
  }

  componentWillReceiveProps(nextProps) {

  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.users !== this.state.users) {
      //this.setState({query});
    }
  }

  isAdmin() {
    return this.props.auth.role === 'admin';
  }

  render() {
    if (!this.isAdmin()) {
      return (
        <Redirect to="/"/>
      )
    }

    return (
      <div className='admin-dashboard'>
        <h3>זהירות אם אתה לא יודע מה לעשות בעמוד זה עדיף שתשאל לפני</h3>
        <br/>
        <br/>
        <span>{this.state.users.size} Users</span>
        <br/>
        <Button onClick={this.unlockDashboard}>אפשר את כל הכפתורים הבאים - מנגנון אזהרה</Button>
        <br/>
        <Button disabled={!this.state.isButtonsUnlocked} onClick={this.setAllUsersToHaveCreateTaskAssignPermissions}>הפוך את כל המשתמשים של המערכת לבעלי הרשאה ליצור משימות ולקחת משימות</Button>
      </div>
    );
  }

  /*
     Goes over all the users and give them permission to create task and assign tasks
   */
  setAllUsersToHaveCreateTaskAssignPermissions() {
    const usersCollection = firebaseDb.collection('users');
    let counter = 1;
    this.state.users.forEach((user, userid) => {
      const userDoc = usersCollection.doc(userid);
      userDoc.update({
        canCreateTask: true,
        canAssignTask: true
      }).then(res => {
        console.log(counter++);
      }).catch(err => {
        console.error(err);
      });
    });
    this.props.showSuccess('Updating ' + this.state.users.size + ' Users... - all have permission to create tasks and assign tasks. Check console and wait for it to reach ' + this.state.users.size);
  }

  unlockDashboard() {
    this.setState({isButtonsUnlocked: !this.state.isButtonsUnlocked});
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
  notificationActions
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminDashboard);
