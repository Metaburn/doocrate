import React, { Component } from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { labelActions, setLabelWithRandomColor } from 'src/labels';
import { projectActions } from 'src/projects';
import { notificationActions } from 'src/notification';
import { buildFilter, tasksActions, taskFilters } from 'src/tasks';
import { commentsActions } from 'src/comments';
import { authActions } from 'src/auth';
import TaskFilters from '../../components/task-filters';
import TaskList from '../../components/task-list';
import TaskView from '../../components/task-view';
import LoaderUnicorn from '../../components/loader-unicorn/loader-unicorn';
import {debounce} from 'lodash';
import { firebaseConfig } from 'src/firebase/config';
import { getUrlSearchParams } from 'src/utils/browser-utils.js';
import i18n from '../../../i18n.js';
import './tasks-page.css';
import { SetUserInfo } from "../../components/set-user-info";
import { updateUserData } from "src/auth/auth";

export class TasksPage extends Component {
  constructor() {
    super(...arguments);
    this.createNewTask = this.createNewTask.bind(this);
    this.isAdmin = this.isAdmin.bind(this);
    this.isGuide = this.isGuide.bind(this);
    this.assignTaskToSignedUser = this.assignTaskToSignedUser.bind(this);
    this.unassignTask = this.unassignTask.bind(this);
    this.goToTask = this.goToTask.bind(this);
    this.onLabelChanged = this.onLabelChanged.bind(this);
    this.onNewTaskAdded = this.onNewTaskAdded.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
    this.submitNewTask = this.submitNewTask.bind(this);
    this.createTask = this.createTask.bind(this);

    this.setCurrentTaskValid = (isValid) => this.setState({isCurrentTaskValid: isValid});

    this.state = {
      tasks: this.props.tasks,
      selectedTask: null,
      newTask: null,
      labels: null,
      projects: null,
      labelPool: {},
      isLoadedComments: false,
      showSetUserInfoScreen: true,
      isCurrentTaskValid: false,
    };

    this.debouncedFilterTasksFromProps = debounce(this.filterTasksFromProps, 50);

    window.changeLabelColor = setLabelWithRandomColor;
  }

  static propTypes = {
    createTask: PropTypes.func.isRequired,
    dismissNotification: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
    buildFilter: PropTypes.func.isRequired,
    loadTasks: PropTypes.func.isRequired,
    loadLabels: PropTypes.func.isRequired,
    loadProjects: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    removeTask: PropTypes.func.isRequired,
    assignTask: PropTypes.func.isRequired,
    tasks: PropTypes.instanceOf(List).isRequired,
    unloadTasks: PropTypes.func.isRequired,
    unloadComments: PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };

  componentWillMount() {
    // TODO
    let project_url = this.props.match.params.projectUrl;
    // Redirect to test project
    if (!project_url) {
      project_url = 'project_test';
      this.props.history.push('/project_test/task/1');
    }
    this.props.loadTasks(project_url);
    this.props.loadLabels();

    // Sets the default loading page
    if(!this.props.filterType && firebaseConfig.defaultPageToLoad) {
      this.props.history.push({
        search: firebaseConfig.defaultPageToLoad
      })
    }

    this.showSetUserInfo();

    //this.props.loadProjects();
  }

  componentWillReceiveProps(nextProps) {
    // if url has a task id - select it
    if (nextProps.match != null && nextProps.match.params.projectUrl && nextProps.match.params.id) {
      const tid = nextProps.match.params.id;

      if (tid === "new-task") {
        if (this.state.newTask == null) {
          this.setState({
            newTask: this.createNewTask()
          });
        }
      } else {
        // Select existing task by tid
        this.setState({
          selectedTask: nextProps.tasks.find((task)=>( task.get('id') === tid ))
        });

        if(!this.state.selectedTask) {
          this.setState({ isLoadedComments: false });
        }

        if(!this.state.isLoadedComments ||
          this.state.selectedTask && tid !== this.state.selectedTask.id) {
            this.setState({ isLoadedComments: true });
            this.props.unloadComments();
            this.props.loadComments(tid);
        }
      }
    } else {
      this.setState({ isLoadedComments: false });
    }

    // prepare filter if exists
    this.debouncedFilterTasksFromProps(nextProps);
  }

  filterTasksFromProps(nextProps) {
    let currentTasks = nextProps.tasks;
    const params = getUrlSearchParams(nextProps.location.search);
    const filterType = params['filter'];
    const filterTextType = params['text'];
    const labelPool = {};

    if (filterType) {
      const filter = this.props.buildFilter(this.props.auth, filterType, filterTextType);
      currentTasks = this.props.filters[filter.type](currentTasks, filter);
    }

    nextProps.tasks.forEach( (t)=> {
      Object.keys(t.label).forEach((l) => {
        labelPool[l] = true;
      })
    });

    currentTasks = this.filterTaskFromLabel(currentTasks)

    this.setState({tasks: currentTasks, labelPool});
  }

  filterTaskFromLabel(tasks) {
    let currentTasks = tasks;
    if ( this.state.labels != null && this.state.labels.length > 0) {
      const filter = this.props.buildFilter(this.props.auth, "label", this.state.labels);
      currentTasks = this.props.filters["label"](currentTasks, filter, this.state.lables);
    }

    return currentTasks;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.labels !== this.state.labels) {
      this.setState({tasks: this.filterTaskFromLabel(this.props.tasks)});
    }
  }

  componentWillUnmount() {
    this.props.unloadTasks();
  }

  filterTasks() {

  }

  onNewTaskAdded(task) {
    const taskObj = this.props.tasks.find((t)=>( t.get('id') === task.id ))
    this.goToTask(taskObj);

    setTimeout(()=>{this.setState({newTask: null})}, 100);
  }

  createNewTask() {
    // const myTasks = this.props.filters[filter.type](this.props.tasks, filter);

    // TODO: Move to a better place
    //if (!this.isAdmin() && myTasks.size >= 20) {
    //  this.props.showError(i18n.t('task.maximum-reached'));
    //  return;
    //}
    //if (!(this.isAdmin() || this.isGuide())) {
    //  this.props.showError(i18n.t('task.new-tasks-closed'));
    //  return;
    //}

    if (!this.props.auth || !(this.props.auth.canCreateTask)) {
      this.props.showError(i18n.t('task.user-new-tasks-closed'));
      const project_url = this.props.match.params.projectUrl;
      this.props.history.push('/'+project_url+'/task/1');

      return;
    }

    const creator = {
      id: this.props.auth.id,
      name: this.props.auth.name,
      email: this.props.auth.updatedEmail || this.props.auth.email,
      photoURL: this.props.auth.photoURL,
    }

    return {id: null, creator: creator, created: new Date()}
  }

  submitNewTask(task) {
    const creator = {
      id: this.props.auth.id,
      name: this.props.auth.name,
      email: this.props.auth.updatedEmail || this.props.auth.email,
      photoURL: this.props.auth.photoURL,
    }

    this.props.createTask(
      {title: task.title, creator, created: new Date(), description: task.description, type: task.type, label: task.label},
      this.onNewTaskAdded);

    this.props.showSuccess(i18n.t('task.created-successfully'));
  }

  isAdmin() {
    return this.props.auth.role === 'admin';
  }

  isGuide() {
    return this.props.auth.role === 'guide';
  }

  assignTaskToSignedUser(task) {
    const myAssignedTasks = this.props.tasks.filter((t)=>{return t.get("assignee") != null && t.get("assignee").id == this.props.auth.id});

    // TODO: Move to a better place
    // if(myAssignedTasks.size >= 5) {
    //   this.props.showError(i18n.t('task.cant-take-messages-limit'));
    //   return;
    // }

    // Uncomment to restrict task assign on the client side only

    //if(!this.isAdmin() && !this.isGuide()) {
    //  this.props.showError(i18n.t('task.cant-take-messages'));
    //  return;
    //}

    if (!this.props.auth.canAssignTask) {
      this.props.showError(i18n.t('task.user-cannot-assign'));
      return;
    }

    this.props.assignTask(task, this.props.auth);
    this.props.showSuccess(i18n.t('task.task-is-yours'));
  }

  unassignTask(task) {
    const isCreator = task.creator && task.creator.id === this.props.auth.id;
    const isAssignee = task.assignee && task.assignee.id === this.props.auth.id;

    // Uncomment this to allow only guide to unassign
    //if(this.isAdmin() || (this.isGuide() && isCreator || isAssignee)) {
    if(this.isAdmin() || isCreator || isAssignee) {
      this.props.unassignTask(task);
      this.props.showSuccess(i18n.t('task.unassigned'));
    }else {
      this.props.showError(i18n.t('task.only-managers-can-unassign'));
      return;
    }
  }

  generateCSV() {
    console.log("generating csv...");
    if (!this.isAdmin()) return;

    const csv = [["TaskId", "Task Name", "CreatorId", "Creator Name" , "AssigneeId", "Assignee Name", "Assignee email"]];

    this.state.tasks.forEach((t) => {
      const tsk = t.toJS();
      let tcsv = [t.id, t.title, t.creator.id, t.creator.name];
      if (t.assignee != null) {
        tcsv = tcsv.concat([t.assignee.id, t.assignee.name, t.assignee.email]);
      }
      csv.push(tcsv);

    });

    return csv;
  }

  confirmUnsavedTask() {
    // If task exists and it's invalid
    if (this.state.selectedTask && !this.state.isCurrentTaskValid) {
      if (window.confirm(i18n.t('task.mission-incomplete'))) {
        return true;
      }
    }

    return false;
  }


  goToTask(task) {
   if (this.confirmUnsavedTask()) {
    return;
   }
    const params = getUrlSearchParams(this.props.location.search);
    const filterType = params['filter'];
    const filterText = params['text'];
    const project_url = this.props.match.params.projectUrl;
    let taskParameter = task? `/${project_url}/task/${task.get('id')}` : `${project_url}/task/1`;

    if (filterType) {
      taskParameter = `${taskParameter}?filter=${filterType}`
      if(filterText) {
        taskParameter += `&text=${filterText}`;
      }
    }

    setTimeout(()=>{this.setState({newTask: null})}, 100);
    this.props.history.push(taskParameter);
  }

  showSetUserInfo() {
    this.setState({showSetUserInfoScreen: !this.props.auth.isEmailConfigured})
  }

  onLabelChanged(labels) {
    this.setState({labels});
  }

  renderSetUserInfo() {

    return (
      <div>
        <SetUserInfo
          isOpen = { (this.state.showSetUserInfoScreen) || this.props.auth.shouldShowUpdateProfile}
          userInfo={ this.props.auth }
          updateUserInfo={ this.updateUserInfo }
          onClosed = { () => {
            this.setState({showSetUserInfoScreen: false});
            this.props.isShowUpdateProfile(false);
            this.setState({showSetUserInfoScreen: false})
          }
          } />
      </div>
    );
  }

  updateUserInfo(userInfo) {
    console.log(userInfo);
    const oldUserData = this.props.auth;
    const newUserData = {};
    newUserData.uid = oldUserData.id;
    newUserData.email = userInfo.email;
    newUserData.isEmailConfigured = true; //This is the flag that specify that this module should not show anymore
    newUserData.displayName = oldUserData.name;
    newUserData.photoURL = oldUserData.photoURL;
    updateUserData(newUserData);
  }

  renderTaskView() {
    if (this.state.selectedTask == null && this.state.newTask == null) {
      return (<div className='task-view-loader'>&nbsp;</div>);
    }

    let taskObj;
    if (this.state.newTask != null) {
      taskObj = this.state.newTask;
    } else if (this.state.selectedTask != null) {
      taskObj = this.state.selectedTask.toJS();
    }

    return (
      <TaskView
        removeTask={this.props.removeTask}
        updateTask={this.props.updateTask}
        selectTask={this.goToTask}
        selectedTask={taskObj}
        isAdmin={this.isAdmin()}
        isGuide={this.isGuide()}
        assignTask={this.assignTaskToSignedUser}
        unassignTask={this.unassignTask}
        unloadComments={this.props.unloadComments}
        createComment={this.props.createComment}
        isValidCallback={this.setCurrentTaskValid}
        isDraft={this.state.newTask != null}
        submitNewTask={this.submitNewTask}
      />)
  }

  createTask() {
    if (!this.props.auth || !(this.props.auth.canCreateTask)) {
      this.props.showError(i18n.t('task.user-new-tasks-closed'));
      return;
    }

    this.props.showSuccess(i18n.t('task.creating-new'));
    // TODO project should be taken from store
    const project_url = this.props.match.params.projectUrl;
    this.props.history.push('/'+project_url+'/task/new-task');
  }

  render() {
    // TODO : use state.tasks instead. It is possible that a filter would
    // return 0 results, but loading has finished
    const isLoading = (!this.state.tasks || this.props.tasks.size <= 0);
    const projectUrl = this.props.match.params.projectUrl;
    return (
      <div>
          <div className="g-col">
            { <TaskFilters
              filter = { this.props.filterType }
              projectUrl = { projectUrl } //TODO - should be from state
              labels = { this.state.labelPool }
              onLabelChange = { this.onLabelChanged }
              generateCSV={this.generateCSV.bind(this)}
              isAdmin={this.isAdmin()}/>
              }
          </div>

        <div className='task-page-wrapper'>
          <LoaderUnicorn isShow={ isLoading }/>
          <div className='task-view-wrapper'>
            { this.renderTaskView() }
          </div>
          <div className='task-list-wrapper'>
            <TaskList
              tasks={this.state.tasks}
              selectTask={this.goToTask}
              createTask={this.createTask}
              selectedTaskId={this.state.selectedTask? this.state.selectedTask.get("id") : ""} //TODO?
              labels = {this.props.labels}
            />
          </div>

          { (this.state.selectedTask == null) ?
            <div className='task-view-bottom-loader'>&nbsp;</div>: ''
          }
        </div>
        { this.renderSetUserInfo() }
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
    labels: state.labels.list,
    projects: state.projects.list,
    filters: taskFilters,
    buildFilter: buildFilter
  }
}

const mapDispatchToProps = Object.assign(
  {},
  tasksActions,
  commentsActions,
  notificationActions,
  labelActions,
  projectActions,
  authActions,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TasksPage);
