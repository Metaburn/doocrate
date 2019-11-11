import React, { Component } from 'react';
import { OrderedMap } from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Redirect } from 'react-router';
import { firebaseDb } from 'src/firebase';
import {CSVLink} from 'react-csv';

import './admin-dashboard.css';
import Button from "../../components/button/button";
import {notificationActions} from "../../../notification";
import { Textbox } from 'react-inputs-validation';
import Textarea from 'react-textarea-autosize';

export class AdminDashboard extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      users: OrderedMap(),
      query: [],
      isButtonsUnlocked: false,
      usersWhoDidntBuy: [],
      usersToAllowToRegisterCount: 0,
      successEmails: [],
      CSVLink: undefined,
    };
    this.setAllUsersToHaveCreateTaskAssignPermissions = this.setAllUsersToHaveCreateTaskAssignPermissions.bind(this);
    this.unlockDashboard = this.unlockDashboard.bind(this);
    this.handleUsersWhoDidntBuy = this.handleUsersWhoDidntBuy.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setUsersToDidntBuy = this.setUsersToDidntBuy.bind(this);
    this.setUsersAllowCreateTasks = this.setUsersAllowCreateTasks.bind(this);
    //this.migrateIsDone = this.migrateIsDone.bind(this);
  }

  static propTypes = {
    auth: PropTypes.object.isRequired
  };

  componentWillMount() {
    // We are ordering the users by creation date to use it in 3. Allowing more users to get tickets

    firebaseDb.collection('users').orderBy('created', 'asc').get().then((querySnapshot) => {
      const users = {};
      querySnapshot.forEach(function(doc) {
        users[doc.id] = doc.data();
      });

      this.setState({users: OrderedMap(users)});
  });
  }

  onCSVLink() {
    this.setState({
      CSVLink: <span>
        <CSVLink className={'button-as-link'} data={this.generateUsersCSV()} >הורדת דוח משתמשים</CSVLink>
      </span>});
  };

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

  generateUsersCSV = () => {
    const { users } = this.state;
    const result = [["Id", "Created", "Email", "Name", "Default Project",
      "Language", "Photo Url", "Bio", "Updated"]];

    users.forEach((user) => {
      let row = [user.id, user.created, user.email, user.name, user.defaultProject,
        user.language, user.photoURL, user.bio, user.updated];
      result.push(row);
    });

    return result;
  };

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
        {
          this.state.CSVLink ?
          this.state.CSVLink :
            <button className={'button-as-link'} onClick={this.onCSVLink.bind(this)}>הכן הורדה של רשימת המשתמשים</button>
        }
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

        <hr/>
        <br />
        <br />
        <h1>3.פתיחת אפשרות לייצר משימות למשתמשים האחרונים שנרשמו</h1>
        { this.renderInput('usersToAllowToRegisterCount', 'מספר משתמשים לפתוח עבורם הרשמה. נגיד 100', this.state.isButtonsUnlocked, 2, false) }
        <br />
        <Button disabled={!this.state.isButtonsUnlocked} onClick={this.setUsersAllowCreateTasks}>פתח את האפשרות לפתוח משימה ולקחת משימה לאנשים הללו</Button>
        { this.state.successEmails && this.state.successEmails.length > 0 ?
          <div>
            <span>
              אימיילים שנפתחה עבורם האפשרות להרשם:
            </span>
            <br/>
            <span>{this.state.successEmails.join(',')}</span>
          </div>
          : ''}

          <br />
        {/*<h1>4.מיגרציה להוסיף לכל המשימות את ה isDone פלאג</h1>*/}
        {/*<Button disabled={!this.state.isButtonsUnlocked} onClick={this.migrateIsDone}>בצע מיגרציה</Button>*/}
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

  renderInput(fieldName, placeholder, isEditable, tabIndex, isAutoFocus) {
    const classNames = isEditable ? ' editable' : '';
    return( <Textbox
      className={`changing-input${classNames}`}
      type = 'text'
      tabIndex = { tabIndex }
      name = { fieldName }
      value = { this.state[fieldName] }
      placeholder={placeholder}
      ref = { e => this[fieldName+'Input'] = e }
      onChange = { this.handleChange }
      onKeyUp={ () => {}} // here to trigger validation callback on Key up
      disabled = { !isEditable }
      autofocus = { isAutoFocus }
    />)
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

  handleChange(n, e) {
    let fieldName = e.target.name;
    this.setState({
      [fieldName]: e.target.value
    });
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
     Goes over the list of given users and allow them to create task and assign themselves
   */
  setUsersAllowCreateTasks() {
    const usersCollection = firebaseDb.collection('users');

    let dontHaveTicketCounter = 0;
    let haveTicketCounter = 0;
    let usersThatShouldHaveTicket = {};
    this.state.users.forEach((user, userid) => {
      if(dontHaveTicketCounter >= this.state.usersToAllowToRegisterCount) {
        return;
      }
      if (!user.canCreateTask) {
        console.log('Dont have ticket counter - ' + dontHaveTicketCounter++);
        // Give him a ticket and email him and output his name
        console.log('Ticket for ' + user.email);
        usersThatShouldHaveTicket[userid] = user;
      }else {
        console.log('Have counter - ' + haveTicketCounter++);
        console.log('Already have ticket for ' + user.email);
      }
    });

    let successCounter = 0;
    let successEmails = [];
    OrderedMap(usersThatShouldHaveTicket).forEach((user, userid) => {
      console.log('About to ticket ' + user.email);
      successEmails.push(user.email);

      const userDoc = usersCollection.doc(userid);
      userDoc.update({
        canCreateTask: true,
        canAssignTask: true
      }).then(res => {
        console.log('Success ' + (successCounter++) + ' ' + user.email);
      }).catch(err => {
        console.error(err);
        console.log('With the following user:');
        console.error(userid);
        console.error(user);
      });
    });

    console.log('Success emails: ' + successEmails);
    this.setState({successEmails});

    this.props.showSuccess('People who didnt have ticket and now have ' + dontHaveTicketCounter + ' People\r\n'+
      'People who have ticket ' + haveTicketCounter);
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


  /**
   * Adds a flag isDone to all the existing tasks
   * Done once. Stored here for future migrations till we have a proper migration system
   */
  // migrateIsDone() {
  //   firebaseDb.collection('projects').get().then((projectSnapshot) => {
  //     let projectCounter = 0;
  //     projectSnapshot.forEach((project) => {
  //       projectCounter++;
  //       const projectData = project.data();
  //       const projectTasksCollection = firebaseDb.collection('projects').doc(projectData.url).collection('tasks');
  //       projectTasksCollection.get().then((tasksSnapshot) => {
  //         let counter = 1;
  //         tasksSnapshot.forEach((task) => {
  //           const taskId = task.id;
  //           projectTasksCollection.doc(taskId).update({
  //             isDone: false
  //           }).then(res => {
  //             counter++;
  //             console.log("User " + projectCounter + ": Counter " + counter);
  //           }).catch(err => {
  //             console.error(err);
  //           });
  //         })
  //       });
  //       debugger;
  //
  //     })
  //
  //   });
  //
  // }

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
};


const mapDispatchToProps = Object.assign(
  {},
  notificationActions
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminDashboard);
