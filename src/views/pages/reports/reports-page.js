import React, {Component} from 'react';
import {Map, List} from 'immutable';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {Redirect} from 'react-router';
import {tasksActions} from 'src/tasks';
import {projectActions} from 'src/projects';

import {firebaseDb} from 'src/firebase';
import {CSVLink} from 'react-csv';

import {I18n} from 'react-i18next';
import './reports-page.css';
import {Textbox} from "react-inputs-validation";
import i18n from "../../../i18n";
import TextAreaAutoresizeValidation from "../../molecules/TextAreaAutoresizeValidation";
import Button from "../../components/button";
import {MePage} from "../me/me-page";

export class ReportsPage extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      users: Map(),
      usersWhoDidntBuy: Map(),
      query: [],
      addedEmailsStr:'',
      validEmails: [],
      invalidEmails: [],
      invitations: [
        {
          id: "1",
          email: "aa.bb",
          created: new Date().toDateString(),
          status: false
        }
      ]
    }
  }

  static propTypes = {
    loadTasks: PropTypes.func.isRequired,
    addEditorUsersEmails: PropTypes.func.isRequired,
    tasks: PropTypes.instanceOf(List).isRequired,
    selectedProject: PropTypes.object,
    selectProjectFromUrl: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    invitations: PropTypes.instanceOf(List).isRequired,
    showSuccess: PropTypes.func.isRequired
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
      querySnapshot.forEach(function (doc) {
        let contributor = doc.data();
        contributors[doc.id] = contributor;
        if (contributor.didntBuy) {
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

      this.props.tasks.forEach((task) => {
        if (task.assignee != null) {
          // assign earliest task for this user
          const prevTask = collaborators[task.assignee.id];
          if (prevTask == null) {
            collaborators[task.assignee.id] = task;
          } else if (prevTask.created > task.created) {
            collaborators[task.assignee.id] = task;
          }
        }
      });

      let counter = 1;
      Object.entries(collaborators).forEach(entry => {
          const [collaboratorId, task] = entry;
          if (this.state.users.has(collaboratorId)) {
            const collaborator = this.state.users.get(collaboratorId);
            // Filter out the didntBuy people
            if (!collaborator.didntBuy) {
              query.push([counter++, collaborator.name, collaboratorId, collaborator.email, task.id, `${task.created.toDate().toLocaleDateString("he-IL")} ${task.created.toDate().toLocaleTimeString("he-IL")}`])
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

  handleTextBoxChange = (o) => {
    let fieldName = o.target.name;

    this.setState({
      [fieldName]: o.target.value,
      invalidEmails: [],
      validEmails: []
    });

  }

  handleSave = () => {
    const {validEmails} = this.state;
    const {addEditorUsersEmails, showSuccess} = this.props;
    addEditorUsersEmails(validEmails);
    showSuccess(i18n.t('reports.emails-updated-successfully'));
  }

  validateEmails= () => {
    const emailArr = this.state.addedEmailsStr.split(';');
    const validEmails = [];
    const invalidEmails = [];

    emailArr.forEach(email => {
      if (this.validateEmail(email)){
        validEmails.push(email);
      }
      else {
        invalidEmails.push(email);
      }
    });

    this.setState({ validEmails });
    this.setState({ invalidEmails });

    return invalidEmails.length > 0;
  }

  validateEmail(email)
  {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    {
      return (true)
    }
    return (false)
  }

  renderValidations() {
    const {invalidEmails, validEmails} = this.state;
    if (invalidEmails.length > 0){
      return (
        <div>
          <p>הכתובות הבאות אינן חוקיות:</p>
          { invalidEmails.map(email => ( <p>{email}</p>))}
        </div>
      );
    }
    if (validEmails.length > 0) {
      return (
        <div>
          <p>כל הכתובות חוקיות</p>
        </div>
      );
    }
  }

  render() {
    // 1: Get all users with at least one tasks that is assigned to them
    // 2: Get report based on a Tag (like in the main page)
    if (!this.isAdmin()) {
      return (
        <Redirect to="/"/>
      )
    }

    if (!this.props.selectedProject) {
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
              <div>
                <h3> אנשים שלקחו על עצמם לפחות משימה אחת</h3>
                {this.state.query.length}

                <br/>
                <CSVLink data={this.state.query}>הורדת הדוח</CSVLink>

                <table className="report-table">
                  <thead>
                  <tr className={`dir-${t('lang-float-reverse')}`}>
                    <th>First task timestamp</th>
                    <th>#</th>
                    <th>Name</th>
                    <th>Id</th>
                    <th>Email</th>
                    <th>Task</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    this.state.query.map((r) => (
                      <tr key={r[0]}>
                        <th>{r[5]}</th>
                        <th><a href={'/' + this.props.selectedProject.url + '/task/' + r[4]}>{r[4]}</a></th>
                        <th>{r[3]}</th>
                        <th>{r[2]}</th>
                        <th>{r[1]}</th>
                        <th>{r[0]}</th>
                      </tr>))
                  }
                  </tbody>
                </table>
              </div>
              <br/>
              <br/>
              <div className={'invitations-form-wrapper'}>
                <h3>{(i18n.t('reports.invitations-header'))}</h3>
                <form>
                <TextAreaAutoresizeValidation
                  fieldName="addedEmailsStr"
                  isEditable="true"
                  placeHolder={i18n.t('reports.emails-placeholder')}
                  isRequired="true"
                  value={this.state.addedEmailsStr}
                  onTextBoxChange={this.handleTextBoxChange}
                  onValidationChange={(fieldName, res) => {}}
                />
                </form>
                <div>
                  {this.renderValidations()}
                </div>
                <div className={'button-save-wrapper'}>
                 <Button
                      className={"save-button"}
                      onClick={this.validateEmails}
                      type='button'>{i18n.t('reports.validate')}</Button>
                  {
                    this.state.invalidEmails.length == 0 &&
                    this.state.validEmails.length > 0
                    && <Button
                    className={"save-button"}
                    onClick={this.handleSave}
                    type='button'>{i18n.t('reports.save')}</Button>
                  }
                </div>
                <table className="report-table">
                  <thead>
                  <tr className={`dir-${t('lang-float-reverse')}`}>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Email</th>
                    <th>#</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    this.state.invitations.map((invitation, index) => (
                      <tr key={invitation.id}>
                        <th>{invitation.status}</th>
                        <th>{invitation.created}</th>
                        <th>{invitation.email}</th>
                        <th>{index}</th>
                      </tr>))
                  }
                  </tbody>
                </table>
              </div>
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
