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
import Textarea from 'react-textarea-autosize';

export class AdminDashboard extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      users: Map(),
      query: [],
      isButtonsUnlocked: false,
      usersWhoDidntBuy: [],
    };
    this.setAllUsersToHaveCreateTaskAssignPermissions = this.setAllUsersToHaveCreateTaskAssignPermissions.bind(this);
    this.unlockDashboard = this.unlockDashboard.bind(this);
    this.handleUsersWhoDidntBuy = this.handleUsersWhoDidntBuy.bind(this);
    this.setUsersToDidntBuy = this.setUsersToDidntBuy.bind(this);
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
        <span> מספר משתמשים במערכת סך הכל {this.state.users.size}</span>
        <br/>
        <Button onClick={this.unlockDashboard}>אפשר את כל הכפתורים הבאים - מנגנון אזהרה</Button>
        <hr/>
        <br/>
        <h1>1.פתיחת אפשרות למשתמשים ליצור ולקחת משימות</h1>
        <Button disabled={!this.state.isButtonsUnlocked} onClick={this.setAllUsersToHaveCreateTaskAssignPermissions}>הפוך את כל המשתמשים של המערכת לבעלי הרשאה ליצור משימות ולקחת משימות</Button>
        <hr/>
        <br />
        <br />
        <h1>2.קביעת משתמשים שלא קנו כרטיס</h1>
        { this.renderUsersWhoDidntBuy('usersWhoDidntBuy', 'משתמשים שלא קנו כרטיס מחולקים בפסיק לדוגמא galbra@test.com,john@gmail.com', this.state.isButtonsUnlocked, 1) }
        <span> סך משתמשים שיושפעו: {this.state.usersWhoDidntBuy.length}</span>
        <br />
        <Button disabled={!this.state.isButtonsUnlocked} onClick={this.setUsersToDidntBuy}>הדלק את הדגל עבור את המשתמשים הללו ל-DidntBuy</Button>
      </div>
    );
  }

  renderUsersWhoDidntBuy(fieldName, placeholder, isEditable, tabIndex) {
    const classNames = isEditable ? ' editable' : ''
    return (
      <Textarea
        className={`changing-input${classNames}`}
        name={fieldName}
        tabIndex={tabIndex}
        value={this.state[fieldName]}
        placeholder={placeholder}
        ref={e => this[fieldName+'Input'] = e}
        onChange={this.handleUsersWhoDidntBuy}
        onBlur = { this.handleUsersWhoDidntBuy } // here to trigger validation callback on Blur
        onKeyUp={ () => {}} // here to trigger validation callback on Key up
        disabled = { !isEditable }
      />
    );
  }

  handleUsersWhoDidntBuy(o) {
    let fieldName = o.target.name;
    // Remove empty spaces
    let parsedString = o.target.value.replace(/\s/g, '');
    // Break it into an array
    if (o.target.value) {
      this.setState({
        [fieldName]: parsedString.split(',')
      });
    }else {
      this.setState({
        [fieldName]: null
      });
    }
  }

  // Find that user in a sluggish way
  findUserByEmail(userEmail) {
    let result = this.state.users.findEntry((user, userid) => {
      return user.email === userEmail
    });
    // Return null if empty
    if(! result) {
      return result;
    }
    // Otherwise return the key
    return result[0];
  }

  /*
     Goes over the list of given users and set the didntBuy flag to true
   */
  setUsersToDidntBuy() {
      const usersCollection = firebaseDb.collection('users');
      let counter = 1;
      this.state.usersWhoDidntBuy.forEach(userWhoDidntBuyEmail => {
        let targetUserId = this.findUserByEmail(userWhoDidntBuyEmail);
        if (!targetUserId) {
          console.log('Cant find a user by that email: ' + userWhoDidntBuyEmail);
          this.props.showError('Cant find a user by the email ' + userWhoDidntBuyEmail + '. Check console for more info');
        } else {
          const userDoc = usersCollection.doc(targetUserId);
          userDoc.update({
            didntBuy: true,
          }).then(res => {
            console.log(counter++);
          }).catch(err => {
            console.error(err);
          });
        }
      });
      this.props.showSuccess('Updating ' + this.state.usersWhoDidntBuy.length + ' Users... - all have flag of didntBuy. Check console and wait for it to reach ' + this.state.usersWhoDidntBuy.length);
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
