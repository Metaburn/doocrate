import React, { Component } from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { labelActions, setLabelWithRandomColor } from 'src/labels';
import { buildFilter, tasksActions, taskFilters} from 'src/tasks';
import { INCOMPLETE_TASKS } from 'src/tasks';

import { commentsActions } from 'src/comments';
import { authActions } from 'src/auth';
import { userInterfaceActions } from 'src/user-interface';
import { notificationActions } from 'src/notification';
import TaskList from '../../components/task-list';
import TaskView from '../../components/task-view';
import LoaderUnicorn from '../../components/loader-unicorn/loader-unicorn';
import { debounce } from 'lodash';
import { firebaseConfig } from 'src/firebase/config';
import { getUrlSearchParams, setQueryParams } from 'src/utils/browser-utils.js';
import i18n from '../../../i18n.js';
import './tasks-page.css';
import { updateUserData } from "src/auth/auth";
import { setCookie } from "../../../utils/browser-utils";
import { I18n } from 'react-i18next';
import { removeQueryParamAndGo } from 'src/utils/react-router-query-utils';
import TopNav from "../../molecules/top-nav/top-nav";


export class TasksPage extends Component {
  constructor() {
    super(...arguments);
    this.createNewTask = this.createNewTask.bind(this);
    this.isAdmin = this.isAdmin.bind(this);
    this.isGuide = this.isGuide.bind(this);
    this.assignTaskToSignedUser = this.assignTaskToSignedUser.bind(this);
    this.unassignTask = this.unassignTask.bind(this);
    this.goToTask = this.goToTask.bind(this);
    this.onNewTaskAdded = this.onNewTaskAdded.bind(this);
    this.submitNewTask = this.submitNewTask.bind(this);
    this.removeComment = this.removeComment.bind(this);

    this.setCurrentTaskValid = (isValid) => this.setState({isCurrentTaskValid: isValid});

    this.state = {
      tasks: this.props.tasks,
      selectedTask: null,
      newTask: null,
      labels: null,
      isLoadedComments: false,
      isCurrentTaskValid: false,
      query: ""
    };

    this.debouncedFilterTasksFromProps = debounce(this.filterTasksFromProps, 50);

    // TODO: unused - remove?
    window.changeLabelColor = setLabelWithRandomColor;
  }

  componentWillMount() {
    let project_url = this.props.match.params.projectUrl;
    // Redirect to test project
    // TODO - Instead should redirect to all project in the world
    if (!project_url) {
      project_url = 'project_test';
      this.props.history.push('/project_test/task/1?complete=false');
    }
    // TODO - should be set by a filter on the user view
    this.props.loadTasks(project_url, INCOMPLETE_TASKS);

    this.props.loadLabels(project_url);

    // Sets the default loading page
    if(!this.props.filterType && firebaseConfig.defaultPageToLoad) {
      this.props.history.push({
        search: firebaseConfig.defaultPageToLoad
      })
    }
  }

  setProjectCookie(projectUrl) {
    // Since we are parsing the url we might get undefined as a string
    if(projectUrl && projectUrl !== 'undefined' && projectUrl !== 'me') {
      setCookie('project', projectUrl);
    }
  }

  componentWillReceiveProps(nextProps) {
    // if url has a task id - select it
    if (nextProps.match != null && nextProps.match.params.projectUrl &&
      nextProps.match.params.id) {

      this.setProjectCookie(nextProps.match.params.projectUrl);

      const tid = nextProps.match.params.id;

      if (tid === "new-task") {
        if (this.state.newTask == null) {
          this.setState({
            newTask: this.createNewTask()
          });
          this.props.unloadComments();
        }
      } else if (tid === "1") {
        this.setState({
          isLoadedComments: false,
          selectedTask: null});
      } else {
        // Select existing task by tid
        this.setState({
          // TODO - perhaps it's faster to use the backend to actually find this specific task
          selectedTask: nextProps.tasks.find((task)=>( task.get('id') === tid ))
        });

        if(!this.state.selectedTask) {
          this.setState({ isLoadedComments: false });
        }

        if(!this.state.isLoadedComments ||
          (this.state.selectedTask && tid !== this.state.selectedTask.id)) {
          this.setState({ isLoadedComments: true });
          this.props.unloadComments();
          let project_url = this.props.match.params.projectUrl;
          this.props.loadComments(project_url, tid);
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
    const filterByLabels = params['labels'];

    const completeFilterValue = params['complete'];

    if (filterType) {
      const filter = this.props.buildFilter(this.props.auth, filterType, filterTextType);
      currentTasks = this.props.filters[filter.type](currentTasks, filter);
    }

    // Complete can be - None, false, true
    if(completeFilterValue || completeFilterValue === 'false') {
      const completeFilter = this.props.buildFilter(this.props.auth, 'complete', completeFilterValue);
      currentTasks = this.props.filters[completeFilter.type](currentTasks, completeFilter);
    }

    currentTasks = this.filterTaskFromLabel(currentTasks, filterByLabels);
    currentTasks = this.filterTaskFromQuery(currentTasks);

    // TODO should not be here
    this.setState({tasks: currentTasks});
  }

  filterTaskFromLabel(tasks, labels) {
    let currentTasks = tasks;
    if ( labels != null && labels.length > 0) {
      const filter = this.props.buildFilter(this.props.auth, "label", this.state.labels);
      currentTasks = this.props.filters["label"](currentTasks, filter, labels);
    }

    return currentTasks;
  }

  filterTaskFromQuery = (tasks) => {
    let currentTasks = tasks;
    const filter = this.props.buildFilter(this.props.auth, "query", this.state.query);
    currentTasks = this.props.filters["query"](currentTasks, filter, this.state.query);
    return currentTasks;
  };

  componentDidUpdate(prevProps, prevState) {
    let {tasks} = this.props;
    // TODO - check that
    /*const params = getUrlSearchParams(this.props.location.search);
    if (prevState.labels !== params['labels']) {
      tasks = this.filterTaskFromLabel(tasks);
      this.setState({tasks});
    }*/

    // Sync url toolbar and the query parameter
    if (prevState.query !== this.state.query) {
      tasks = this.filterTaskFromQuery(tasks);
      this.setState({tasks});
    }
  }

  componentWillUnmount() {
    this.props.unloadTasks();
  }

  onNewTaskAdded(task) {
    //Remove this to keeps the user on the same page - allowing to create another new task
    const taskObj = this.props.tasks.find((t)=>( t.get('id') === task.id ));
    this.goToTask(taskObj);
    setTimeout(()=>{this.setState({newTask: null})}, 100);
  }

  createNewTask() {
    if (!this.props.auth || (this.props.selectedProject && !(this.props.selectedProject.canCreateTask))) {
      this.props.showError(i18n.t('task.user-new-tasks-closed'));
      const project_url = this.props.match.params.projectUrl;
      this.props.history.push('/'+project_url+'/task/1?complete=false');

      return;
    }

    const creator = {
      id: this.props.auth.id,
      name: this.props.auth.name,
      email: this.props.auth.updatedEmail || this.props.auth.email,
      photoURL: this.props.auth.photoURL,
    };

    return {id: null, creator: creator, created: new Date()}
  }

  submitNewTask(task) {
    const creator = {
      id: this.props.auth.id,
      name: this.props.auth.name,
      email: this.props.auth.updatedEmail || this.props.auth.email,
      photoURL: this.props.auth.photoURL,
    };

    this.props.createTask(
      {title: task.title, creator, created: new Date(), description: task.description, requirements: task.requirements, type: task.type, label: task.label},
      this.props.auth,
      this.onNewTaskAdded);

    // Probably should only show on real success
    this.props.showSuccess(i18n.t('task.created-successfully'));
  }

  // Check if admin of that project
  isAdmin() {
    const project_url = this.props.match.params.projectUrl;
    return this.props.auth.role === 'admin' &&
      this.props.auth.adminProjects.includes(project_url);
  }

  isGuide() {
    return this.props.auth.role === 'guide';
  }

  assignTaskToSignedUser(task) {
    if (!this.props.selectedProject.canAssignTask) {
      this.props.showError(i18n.t('task.user-cannot-assign'));
      return;
    }

    this.props.assignTask(task, this.props.auth);
    this.props.showSuccess(i18n.t('task.task-is-yours'));
  }

  followTaskToSignedUser = (task) => {
    this.props.followTask(task, this.props.auth);
    this.props.showSuccess(i18n.t('task.follow-task-completed'));
  };

  unfollowTaskToSignedUser = (task) => {
    this.props.unfollowTask(task, this.props.auth);
    this.props.showSuccess(i18n.t('task.unfollow-task-completed'));
  };

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

  removeComment(comment) {
    this.props.removeComment(comment);
    this.props.showSuccess(i18n.t('comments.comment-deleted'));
  };

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
    const project_url = this.props.match.params.projectUrl;
    let taskParameter = task? `/${project_url}/task/${task.get('id')}` : `/${project_url}/task/1`;

    if (this.props.location.search) {
      taskParameter += this.props.location.search;
    }

    setTimeout(()=>{this.setState({newTask: null})}, 100);
    this.props.history.push(taskParameter);
  }

  onQueryChange = (query) => {
    this.setState({query});
    this.props.history.push({
      search: setQueryParams(['query='+query])
    });
  };


  updateUserInfo(userInfo) {
    const oldUserData = this.props.auth;
    const newUserData = {};
    newUserData.uid = oldUserData.id;
    newUserData.email = userInfo.email;
    newUserData.isEmailConfigured = true; //This is the flag that specify that this module should not show anymore
    newUserData.displayName = userInfo.name;
    newUserData.photoURL = userInfo.photoURL;
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
        selectedProject={this.props.selectedProject}
        isAdmin={this.isAdmin()}
        isGuide={this.isGuide()}
        assignTask={this.assignTaskToSignedUser}
        followTask={this.followTaskToSignedUser}
        unfollowTask={this.unfollowTaskToSignedUser}
        unassignTask={this.unassignTask}
        unloadComments={this.props.unloadComments}
        createComment={this.props.createComment}
        updateComment={this.props.updateComment}
        removeComment={this.removeComment}
        isValidCallback={this.setCurrentTaskValid}
        isDraft={this.state.newTask != null}
        submitNewTask={this.submitNewTask}
      />)
  }

  createTask = () => {
    if (!this.props.auth || !(this.props.selectedProject.canCreateTask)) {
      this.props.showError(i18n.t('task.user-new-tasks-closed'));
      return;
    }

    this.props.showSuccess(i18n.t('task.creating-new'));
    // TODO project should be taken from store
    const project_url = this.props.match.params.projectUrl;
    this.props.history.push('/'+project_url+'/task/new-task?complete=false');
  };

  getTaskTypesFromProject = (index) => {
    if (!this.props.selectedProject ||
      !this.props.selectedProject.taskTypes ||
      this.props.selectedProject.taskTypes.length <= 0 ||
      this.props.selectedProject.taskTypes.length <= index
    ) {
      return '';
    }else {
      return this.props.selectedProject.taskTypes[index];
    }
  };

  getSelectedFilters = () => {
    const params = getUrlSearchParams();
    const filter = params['filter'];
    const taskType = params['text'];
    const labels = params['labels'];

    const results = [];
    if(filter === 'taskType' && taskType) {
      results.push({type:'filter', value: this.getTaskTypesFromProject(taskType - 1)});
    }
    if(filter === 'mine') {
      results.push({type:'filter', value: i18n.t('task.my-tasks')});
    }
    if(filter === 'unassigned') {
      results.push({type:'filter', value: i18n.t('task.free-tasks')});
    }
    if(labels) {
      if(typeof(labels) === 'string') {
        results.push({type:'labels', value: labels});
      }else {
        labels.forEach((label) => {
          results.push({type:'labels', value: label});
        });
      }
    }
    return results;
  };

  getSelectedFilterTitle = () => {
    const params = getUrlSearchParams();
    const filter = params['filter'];

    if(filter === 'mine') {
      return(i18n.t('task.my-tasks'));
    }
    if(filter === 'unassigned') {
      return(i18n.t('task.free-tasks'))
    }
    return(i18n.t('task.all-tasks'));
  };

  removeQueryByLabel = (type, value) => {
    removeQueryParamAndGo(this.props.history, [type], value);
  };

  render() {
    // TODO : use state.tasks instead. It is possible that a filter would
    // return 0 results, but loading has finished
    const isNewTask = this.props.match && this.props.match.params && this.props.match.params.id === 'new-task';
    const isLoading = (!this.state.tasks || (this.props.tasks.size <= 0 && !isNewTask));
    const projectUrl = this.props.match.params.projectUrl;

    const selectedFilters = this.getSelectedFilters();
    const isFiltersActive = selectedFilters.length > 0;
    const tasksCount = (this.state.tasks && this.state.tasks.size >0) ? this.state.tasks.size : null;
    const title = this.getSelectedFilterTitle();

    return (
      <I18n ns='translations'>
        {
          (t, { i18n }) => (
          <div className={'task-page-root-wrapper'}>
            <div className={'top-nav-wrapper'}>
              <TopNav onQueryChange={this.onQueryChange}
                      isFilterActive={isFiltersActive}
                      query={this.state.query}
                      setMenuOpen={this.props.setMenuOpen}
                      selectedFilters={selectedFilters}
                      createTask={this.createTask}
                      removeQueryByLabel={this.removeQueryByLabel}
                      tasksCount={tasksCount}
                      title={title}/>
            </div>

            <div className='task-page-wrapper'>
              <LoaderUnicorn isShow={ isLoading }/>
              <div className='task-view-wrapper'>
                { this.renderTaskView() }
              </div>
              <div className='task-list-wrapper'>
                <TaskList history={this.props.history}
                  tasks={this.state.tasks}
                  selectTask={this.goToTask}
                  selectedTaskId={this.state.selectedTask? this.state.selectedTask.get("id") : ""} //TODO?
                  selectedProject = { this.props.selectedProject }
                  projectUrl = { projectUrl } //TODO - should be from state
                />
              </div>

              { (this.state.selectedTask == null) ?
                <div className='task-view-bottom-loader'>&nbsp;</div>: ''
              }
            </div>
          </div>
          )
        }
      </I18n>
    )
  }
}

TasksPage.propTypes = {
  createTask: PropTypes.func.isRequired,
  dismissNotification: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  buildFilter: PropTypes.func.isRequired,
  loadTasks: PropTypes.func.isRequired,
  loadLabels: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  removeTask: PropTypes.func.isRequired,
  assignTask: PropTypes.func.isRequired,
  tasks: PropTypes.instanceOf(List).isRequired,
  unloadTasks: PropTypes.func.isRequired,
  unloadComments: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  setMenuOpen: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};


//=====================================
//  CONNECT
//-------------------------------------
const mapStateToProps = (state) => {
  return {
    tasks: state.tasks.list,
    auth: state.auth,
    selectedProject: state.projects.selectedProject,
    labels: (state.projects.selectedProject && state.projects.selectedProject.popularTags)? Object.keys(state.projects.selectedProject.popularTags) : null,
    filters: taskFilters,
    buildFilter: buildFilter
  }
};



const mapDispatchToProps = Object.assign(
  {},
  tasksActions,
  commentsActions,
  notificationActions,
  labelActions,
  authActions,
  userInterfaceActions
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TasksPage);
