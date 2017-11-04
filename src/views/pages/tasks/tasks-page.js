import React, { Component } from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { labelActions, changeLabelColor, setLabelWithRandomColor } from 'src/labels';
import { projectActions } from 'src/projects';
import { authActions, getAuth } from 'src/auth';
import { getNotification, notificationActions } from 'src/notification';
import { buildFilter, tasksActions, taskFilters } from 'src/tasks';
import { commentsActions } from 'src/comments';
import Notification from '../../components/notification';
import TaskFilters from '../../components/task-filters';
import TaskList from '../../components/task-list';
import TaskView from '../../components/task-view';
import classNames from 'classnames';
import LoaderUnicorn from '../../components/loader-unicorn/loader-unicorn';
import {debounce} from 'lodash';
import { getUrlSearchParams } from 'src/utils/browser-utils.js';

import './tasks-page.css';

export class TasksPage extends Component {
  constructor() {
    super(...arguments);
    this.createNewTask = this.createNewTask.bind(this);
    this.isAdmin = this.isAdmin.bind(this);
    this.isGuide = this.isGuide.bind(this);
    this.assignTaskToSignedUser = this.assignTaskToSignedUser.bind(this);
    this.goToTask = this.goToTask.bind(this);
    this.onLabelChanged = this.onLabelChanged.bind(this);
    this.onNewTaskAdded = this.onNewTaskAdded.bind(this);
    
    this.state = {
      tasks: this.props.tasks,
      selectedTask: null,
      labels: null,
      projects: null,
      labelPool: {},
      isLoadedComments: false
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
    notification: PropTypes.object.isRequired,
    removeTask: PropTypes.func.isRequired,
    assignTask: PropTypes.func.isRequired,
    tasks: PropTypes.instanceOf(List).isRequired,
    unloadTasks: PropTypes.func.isRequired,
    unloadComments: PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.loadTasks();
    this.props.loadLabels();
    //this.props.loadProjects();
  }

  componentWillReceiveProps(nextProps) {
    // if url has a task id - select it
    if (nextProps.match != null && nextProps.match.params.id) {
      const tid = nextProps.match.params.id;

      this.setState({
        selectedTask: this.props.tasks.find((task)=>( task.get('id') == tid ))
      })

      if(!this.state.selectedTask) {
        this.setState({ isLoadedComments: false });
      }

      if(!this.state.isLoadedComments || 
        this.state.selectedTask && tid != this.state.selectedTask.id) {
          this.setState({ isLoadedComments: true });
          this.props.unloadComments();
          this.props.loadComments(tid);
      }
    } else {
      this.setState({ isLoadedComments: false });
    }

    // prepare filter if exists
    this.debouncedFilterTasksFromProps(nextProps);
  }

  filterTasksFromProps(nextProps) {
    let curTasks = nextProps.tasks;
    const params = getUrlSearchParams(nextProps.location.search);
    const filterType = params['filter'];
    const labelPool = {};
    
    if (filterType) {      
      const filter = this.props.buildFilter(this.props.auth, filterType);
      curTasks = this.props.filters[filter.type](curTasks, filter);
    }

    nextProps.tasks.forEach( (t)=> {
      Object.keys(t.label).forEach((l) => {
        labelPool[l] = true;
      })
    })
    
    curTasks = this.filterTaskFromLabel(curTasks)  

    this.setState({tasks: curTasks, labelPool});  
  }

  filterTaskFromLabel(tasks) {
    let curTasks = tasks;
    if ( this.state.labels != null && this.state.labels.length > 0) {
      const filter = this.props.buildFilter(this.props.auth, "label", this.state.labels);
      curTasks = this.props.filters["label"](curTasks, filter, this.state.lables);
    }

    return curTasks;
  }

  componentDidUpdate(prevProps, prevState) {    
    if (prevState.labels != this.state.labels) {
      this.setState({tasks: this.filterTaskFromLabel(this.props.tasks)});  
    } 
  }

  componentWillUnmount() {
    this.props.unloadTasks();
  }

  filterTasks() {
    
  }

  renderNotification() {
    const { notification } = this.props;
    return (
      <Notification
        action={()=> { }}
        actionLabel={notification.actionLabel}
        dismiss={this.props.dismissNotification}
        display={notification.display}
        message={notification.message}
        type={notification.type}
      />
    );
  }

  onNewTaskAdded(task) {
    const taskObj = this.props.tasks.find((t)=>( t.get('id') == task.id ))
    this.goToTask(taskObj);
  }

  createNewTask() {
    const filter = this.props.buildFilter(this.props.auth, "mine");
    const myTasks = this.props.filters[filter.type](this.props.tasks, filter);

    // TODO: Move to a better place
    // if (!this.isAdmin() && myTasks.size >= 8) {
    //   this.props.showError('הגעת למכסת המשימות שניתן לייצר');
    //   return;
    // }
    if (!this.isAdmin() && !this.isGuide()) {
      this.props.showError('יצירת משימות חדשות סגורה כעת לאדמינים ולמדריכים בלבד');
      return;
    }
    
    let creator = {
      id: this.props.auth.id,
      name: this.props.auth.name,
      email: this.props.auth.email,
      photoURL: this.props.auth.photoURL,
    }
    
    this.props.createTask(
      {creator , created: new Date()}, 
      this.onNewTaskAdded);
  }

  isAdmin() {
    return this.props.auth.role == 'admin';
  }

  isGuide() {
    return this.props.auth.role == 'guide';
  }

  assignTaskToSignedUser(task) {
    const myAssignedTasks = this.props.tasks.filter((t)=>{return t.get("assignee") != null && t.get("assignee").id == this.props.auth.id});

    // TODO: Move to a better place
    // if(myAssignedTasks.size >= 4) {
    //   this.props.showError('הגעת למכסת המשימות לאדם. לא ניתן לקחת משימות נוספות כרגע');
    //   return;
    // }

    if(!this.isAdmin() && !this.isGuide()) {
      this.props.showError('לא ניתן לקחת משימות כרגע. אופצייה זו תפתח שוב בקרוב');
      return;
    }

    this.props.assignTask(task, this.props.auth);
  }

  goToTask(task) {
    const params = getUrlSearchParams(this.props.location.search);
    const filterType = params['filter'];
    let taskParameter = task? `/task/${task.get("id")}` : `/task/1`;

    if (filterType) {
      taskParameter = `${taskParameter}?filter=${filterType}`
    }
    this.props.history.push(taskParameter);
  }

  onLabelChanged(labels) {
    this.setState({labels});
  }

  renderTaskView() {
    const isLoading = (!this.state.tasks || this.props.tasks.size <= 0);
    if (this.state.selectedTask == null) {
      return (<div className='task-view-loader'>&nbsp;</div>);
    }
    
    return (
      <TaskView 
        removeTask={this.props.removeTask}
        updateTask={this.props.updateTask}
        selectTask={this.goToTask}
        selectedTask={this.state.selectedTask.toJS()}
        isAdmin={this.isAdmin()}
        isGuide={this.isGuide()}
        assignTask={this.assignTaskToSignedUser}
        unloadComments={this.props.unloadComments}
        createComment={this.props.createComment}
      />)
  }

  render() {
    // TODO : use state.tasks instead. It is possible that a filter would 
    // return 0 results, but loading has finished
    const isLoading = (!this.state.tasks || this.props.tasks.size <= 0);
    return (
      <div>
          <div className="g-col">
            { <TaskFilters filter={this.props.filterType} labels={this.state.labelPool} onLabelChange= {this.onLabelChanged}/> }
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
              createTask={this.createNewTask}
              selectedTaskId={this.state.selectedTask? this.state.selectedTask.get("id") : ""}
              labels = {this.props.labels}
            />
          </div>

          { (this.state.selectedTask == null) ? 
            <div className='task-view-bottom-loader'>&nbsp;</div>: ''
          }

          {this.props.notification.display ? this.renderNotification() : null}
        </div>
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
    notification: state.notification,
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
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TasksPage);