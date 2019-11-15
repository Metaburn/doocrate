import React, { Component } from "react";
import { List } from "immutable";
import _ from "lodash";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { labelActions, setLabelWithRandomColor } from "src/labels";
import { buildFilter, tasksActions, taskFilters } from "src/tasks";
import { INCOMPLETE_TASKS } from "src/tasks";
import { commentsActions } from "src/comments";
import { authActions } from "src/auth";
import { projectActions } from "src/projects";
import { userInterfaceActions } from "src/user-interface";
import { notificationActions } from "src/notification";
import TaskSideView from "../../components/task-view/TaskSideView";
import LoaderUnicorn from "../../components/loader-unicorn/loader-unicorn";
import { firebaseConfig } from "src/firebase/config";
import { getUrlSearchParams, setQueryParams } from "src/utils/browser-utils.js";
import i18n from "src/i18n.js";
import { updateUserData } from "src/auth/auth";
import { setCookie } from "../../../utils/browser-utils";
import { removeQueryParamAndGo } from "src/utils/react-router-query-utils";
import TopNav from "../../molecules/top-nav/top-nav";
import TaskViewMiniList from "../../molecules/taskViewMiniList/taskViewMiniList";

import "./tasks-page.css";

export class TasksPage extends Component {
  constructor(props) {
    super(props);

    this.setCurrentTaskValid = isValid =>
      this.setState({ isCurrentTaskValid: isValid });

    const taskId = props.match.params.id;

    this.state = {
      filteredTasks: [],
      selectedTaskId: taskId,
      newTask: null,
      isLoadedComments: false,
      isCurrentTaskValid: false,
      searchQuery: ""
    };

    this.getNewTask = this.getNewTask.bind(this);
    this.isAdmin = this.isAdmin.bind(this);
    this.isGuide = this.isGuide.bind(this);
    this.assignTaskToSignedUser = this.assignTaskToSignedUser.bind(this);
    this.unassignTask = this.unassignTask.bind(this);
    this.onNewTaskAdded = this.onNewTaskAdded.bind(this);
    this.submitNewTask = this.submitNewTask.bind(this);
    this.removeComment = this.removeComment.bind(this);
    this.resetSelectedTask = this.resetSelectedTask.bind(this);

    // TODO: unused - remove?
    window.changeLabelColor = setLabelWithRandomColor;
  }

  componentWillMount() {
    if (!this.props.selectedProject) {
      this.props.history.push("/");
      return;
    }

    let project_url = this.props.selectedProject.url;

    // First time this page is loaded
    if (!this.props.tasks || this.props.tasks.size <= 0) {
      this.props.loadTasks(project_url, INCOMPLETE_TASKS);
      this.props.loadLabels(project_url);
    }

    // Sets the default loading page
    if (!this.props.filterType && firebaseConfig.defaultPageToLoad) {
      this.props.history.push({
        search: firebaseConfig.defaultPageToLoad
      });
    }

    this.getFilterParams(this.props);

    const selectedTaskId = this.props.match.params.id;

    if (selectedTaskId === "new-task") {
      // New task
      if (this.state.newTask == null) {
        this.createTask();
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const selectedTaskId = nextProps.match.params.id;

    if(_.get(this.props, "location.search") !== _.get(nextProps, "location.search")){
      this.getFilterParams(nextProps);
    }

    //if url has a task id - select it
    if (
      nextProps.match != null &&
      nextProps.match.params.projectUrl &&
      nextProps.match.params.id
    ) {
      this.setProjectCookie(nextProps.match.params.projectUrl);

      if (selectedTaskId === "new-task") {
        // New task
        if (this.state.newTask == null) {
          this.setState({
            selectedTaskId: null,
            newTask: this.getNewTask(),
            isLoadedComments: false
          });
          this.props.unloadComments();
        }
      } else if (selectedTaskId === "1") {
        // No task selected - same as project page
        this.setState({
          isLoadedComments: false,
          selectedTaskId: null,
          newTask: null
        });
      } else {
        // Load selected task
        if (!this.state.selectedTaskId) {
          this.setState({ isLoadedComments: false });
        }

        if (
          !this.state.isLoadedComments ||
          selectedTaskId !== this.state.selectedTaskId
        ) {
          // Select the task
          this.setState({
            isLoadedComments: true,
            selectedTaskId: selectedTaskId,
            newTask: null
          });
          this.props.unloadComments();
          let project_url = this.props.match.params.projectUrl;
          this.props.loadComments(project_url, selectedTaskId);
        }
      }
    } else {
      this.setState({ isLoadedComments: false, selectedTaskId: null });
    }
  }

  setProjectCookie(projectUrl) {
    // Since we are parsing the url we might get undefined as a string
    if (
      projectUrl &&
      projectUrl !== "undefined" &&
      projectUrl !== "me" &&
      projectUrl !== "[object Object]"
    ) {
      setCookie("project", projectUrl);
    }
  }

  getFilterParams = (props) => {
    const urlParams = getUrlSearchParams(props.location.search);
    this.setState({
      filterParams: {
        filter: urlParams["filter"] || null,
        typeText: urlParams["text"] || null,
        complete: urlParams["complete"] || null,
        labels: urlParams["labels"] || null,
        query: urlParams["query"] || this.state.searchQuery || null
      }
    });
  };

  filterTasksFromState(nextFilters, tasks) {
    let filteredTasks;
    filteredTasks = this.filterByFilterType(nextFilters, tasks);
    filteredTasks = this.filterByComplete(nextFilters, filteredTasks);
    filteredTasks = this.filterTaskFromLabel(nextFilters, filteredTasks);
    filteredTasks = this.filterTaskFromQuery(nextFilters, filteredTasks);


    return filteredTasks;
    // this.setState({ filteredTasks });
    // this.updateFilter (nextFilters);
    // this.props.setFilteredTasks(filteredTasks);
  }

  filterByFilterType(nextFilters, tasks) {
    const filterType = nextFilters.filter;
    const filterTextType = nextFilters.typeText;

    if (filterType) {
      const filter = this.props.buildFilter(
        this.props.auth,
        filterType,
        filterTextType
      );
      tasks = this.props.filters[filter.type](tasks, filter);
    }

    return tasks;
  }

  filterByComplete(nextFilters, tasks) {
    const completeFilterValue = nextFilters.complete;
    if (completeFilterValue || completeFilterValue === "false") {
      const completeFilter = this.props.buildFilter(
        this.props.auth,
        "complete",
        completeFilterValue
      );
      tasks = this.props.filters[completeFilter.type](tasks, completeFilter);
    }
    return tasks;
  }

  filterTaskFromLabel(nextFilters, tasks) {
    const { auth, buildFilter, filters } = this.props;
    const labels = nextFilters.labels;
    if (labels != null && labels.length > 0) {
      const filter = buildFilter(auth, "label", labels);
      tasks = filters["label"](tasks, filter, labels);
    }

    return tasks;
  }

  filterTaskFromQuery = (nextFilters, tasks) => {
    const { auth, buildFilter, filters } = this.props;
    const query = nextFilters.query;
    if (query) {
      const filter = buildFilter(auth, "query", query);
      tasks = filters["query"](tasks, filter, query);
    }
    return tasks;
  };

  onNewTaskAdded(task) {
    // Remove this to keeps the user on the same page - allowing to create another new task
    // Probably should only show on real success
    this.props.showSuccess(i18n.t("task.created-successfully"));

    // Navigate to newly created task
    const project_url = this.props.match.params.projectUrl;
    setTimeout(() => {
      this.props.history.push(`/${project_url}/task/${task.id}?complete=false`);
    }, 100);
  }

  getAnyTasksCreatedAssignedToUser = () => {
    const { auth, tasks } = this.props;

    const result = tasks.find(task => {
      return (
        task.creator.id === auth.id ||
        (task.assignee && task.assignee.id === auth.id)
      );
    });
    return typeof result !== "undefined";
  };

  getNewTask() {
    const {auth} = this.props;
    const creator = {
      id: auth.id,
      name: auth.name,
      email: auth.updatedEmail || auth.email,
      photoURL: auth.photoURL,
    };

    return { id: null, creator: creator, created: new Date() };
  }

  submitNewTask(task) {
    const creator = {
      id: this.props.auth.id,
      name: this.props.auth.name,
      email: this.props.auth.updatedEmail || this.props.auth.email,
      photoURL: this.props.auth.photoURL
    };

    this.props.createTask(
      {
        title: task.title,
        creator,
        created: new Date(),
        description: task.description,
        requirements: task.requirements,
        type: task.type,
        label: task.label
      },
      this.props.auth,
      this.onNewTaskAdded
    );
  }

  // Check if admin of that project
  isAdmin() {
    const {auth} = this.props;
    const project_url = this.props.match.params.projectUrl;
    return auth.role === "admin" &&
      auth.adminProjects.includes(project_url);
  }

  isGuide() {
    return this.props.auth.role === "guide";
  }

  assignTaskToSignedUser(task) {
    if (!this.props.selectedProject.canAssignTask) {
      if (!this.getAnyTasksCreatedAssignedToUser()) {
        this.props.showError(i18n.t("task.user-cannot-assign"));
        return;
      }
    }

    this.props.assignTask(task, this.props.auth);
    this.props.showSuccess(i18n.t("task.task-is-yours"));
  }

  followTaskToSignedUser = task => {
    this.props.followTask(task, this.props.auth);
    this.props.showSuccess(i18n.t("task.follow-task-completed"));
  };

  unfollowTaskToSignedUser = task => {
    this.props.unfollowTask(task, this.props.auth);
    this.props.showSuccess(i18n.t("task.unfollow-task-completed"));
  };

  unassignTask(task) {
    const isCreator = task.creator && task.creator.id === this.props.auth.id;
    const isAssignee = task.assignee && task.assignee.id === this.props.auth.id;

    // Uncomment this to allow only guide to unassign
    //if(this.isAdmin() || (this.isGuide() && isCreator || isAssignee)) {
    if (this.isAdmin() || isCreator || isAssignee) {
      this.props.unassignTask(task);
      this.props.showSuccess(i18n.t("task.unassigned"));
    } else {
      this.props.showError(i18n.t("task.only-managers-can-unassign"));
      return;
    }
  }

  removeComment(comment) {
    this.props.removeComment(comment);
    this.props.showSuccess(i18n.t("comments.comment-deleted"));
  }

  confirmUnsavedTask() {
    // If task exists and it's invalid
    if (this.state.selectedTask && !this.state.isCurrentTaskValid) {
      if (window.confirm(i18n.t("task.mission-incomplete"))) {
        return true;
      }
    }

    return false;
  }

  onQueryChange = query => {
    this.setState({
      searchQuery: query,
      filterParams: { ...this.state.filterParams, query }
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

  getTaskViewProps() {
    const { selectedTaskId, newTask } = this.state;
    const { tasks, selectedProjectUserPermissions } = this.props;

    // TODO - is this the right place to make this decision?
    let selectedTask;
    if (newTask) {
      selectedTask = newTask;
    } else {
      selectedTask = tasks.find(task => task.get("id") === selectedTaskId);
    }

    return {
      selectedTask,
      onDeleteTask: this.props.deleteTask,
      selectedProject: this.props.selectedProject,
      isAdmin: this.isAdmin(),
      isGuide: this.isGuide(),
      assignTask: this.assignTaskToSignedUser,
      followTask: this.followTaskToSignedUser,
      unfollowTask: this.unfollowTaskToSignedUser,
      updateTask: this.props.updateTask,
      unassignTask: this.unassignTask,
      unloadComments: this.props.unloadComments,
      createComment: this.props.createComment,
      updateComment: this.props.updateComment,
      removeComment: this.removeComment,
      isValidCallback: this.setCurrentTaskValid,
      isDraft: this.state.newTask != null,
      submitNewTask: this.submitNewTask,
      isTaskVisible: !!this.state.selectedTask,
      resetSelectedTask: this.resetSelectedTask,
      userPermissions: selectedProjectUserPermissions
    };
  }

  createTask = () => {
    const { auth } = this.props;
    if (!auth || !this.props.selectedProject.canCreateTask) {
      // Check if user has a task created / assigned already
      if (!this.getAnyTasksCreatedAssignedToUser()) {
        this.props.showError(i18n.t("task.user-new-tasks-closed"));
        return;
      }
    }

    // TODO project should be taken from store
    const project_url = this.props.match.params.projectUrl;
    this.props.history.push(
      "/" + project_url + "/task/new-task?complete=false"
    );
  };

  getTaskTypesFromProject = index => {
    if (
      !this.props.selectedProject ||
      !this.props.selectedProject.taskTypes ||
      this.props.selectedProject.taskTypes.length <= 0 ||
      this.props.selectedProject.taskTypes.length <= index
    ) {
      return "";
    } else {
      return this.props.selectedProject.taskTypes[index];
    }
  };

  getSelectedFilters = () => {
    const params = getUrlSearchParams();
    const filter = params["filter"];
    const taskType = params["text"];
    const labels = params["labels"];

    const results = [];
    if (filter === "taskType" && taskType) {
      results.push({
        type: "filter",
        value: this.getTaskTypesFromProject(taskType - 1)
      });
    }
    if (filter === "mine") {
      results.push({ type: "filter", value: i18n.t("task.my-tasks") });
    }
    if (filter === "unassigned") {
      results.push({ type: "filter", value: i18n.t("task.free-tasks") });
    }
    if (labels) {
      if (typeof labels === "string") {
        results.push({ type: "labels", value: labels });
      } else {
        labels.forEach(label => {
          results.push({ type: "labels", value: label });
        });
      }
    }
    return results;
  };

  getSelectedFilterTitle = () => {
    const params = getUrlSearchParams();
    const filter = params["filter"];

    if (filter === "mine") {
      return i18n.t("task.my-tasks");
    }
    if (filter === "unassigned") {
      return i18n.t("task.free-tasks");
    }
    return i18n.t("task.all-tasks");
  };

  removeQueryByLabel = (type, value) => {
    removeQueryParamAndGo(this.props.history, [type], value);
  };

  resetSelectedTask() {
    this.setState({
      newTask: null,
      selectedTaskId: null
    });
    const { auth, selectedProject } = this.props;

    const projectUrl =
      selectedProject && selectedProject.url
        ? selectedProject.url
        : auth.defaultProject;

    this.props.history.push({
      pathname: `/${projectUrl}/task/1`,
      search: this.props.location.search
    });
  }

  onSelectTask = task => {
    const projectUrl = this.props.match.params.projectUrl;
    const search = this.props.location ? this.props.location.search : "";
    const taskRoute = `/${projectUrl}/task/${task.id}${search}`;
    this.props.history.push(taskRoute);
  };

  onLabelClick = (label, event) => {
    if (event) {
      event.stopPropagation();
    }
    this.props.history.push({
      search: setQueryParams(["labels=" + label])
    });
  };

  onClearFilters = () => {
    this.props.history.push({ search: "" });
  };

  render() {
    const { selectedProjectUserPermissions, match, tasks, setMenuOpen } = this.props;
    const { selectedTaskId, searchQuery, filterParams } = this.state;
    const selectedFilters = this.getSelectedFilters();

    const filteredTasks =
      (filterParams && this.filterTasksFromState(filterParams, tasks)) || tasks;

    const isLoading = tasks.size <= 0;
    const projectUrl = match.params.projectUrl;

    const isFiltersActive = selectedFilters.length > 0;
    const tasksCount =
      (filteredTasks.length > 0 && filteredTasks.length) || tasks.length;
    const title = this.getSelectedFilterTitle();

    // todo: a better implementation is to calculate the filters from params with reselect, cause now every render cycle
    // here sends <TopNav> a new object for 'query' param

    return (
      <div className="task-page-root-wrapper">
        <TaskSideView {...this.getTaskViewProps()} />
        <div className="top-nav-wrapper">
          <TopNav
            onQueryChange={this.onQueryChange}
            isFilterActive={isFiltersActive}
            setMenuOpen={setMenuOpen}
            selectedFilters={selectedFilters}
            createTask={this.createTask}
            removeQueryByLabel={this.removeQueryByLabel}
            tasksCount={tasksCount}
            title={title}
            userPermissions={selectedProjectUserPermissions}
            query={searchQuery}
          />
        </div>

        <div className="task-page-wrapper">
          <LoaderUnicorn isShow={isLoading} />

          <div className="task-list-wrapper">
            <TaskViewMiniList
              shouldShowWizardOnNoResults={false}
              setTour={this.props.setTour}
              projectUrl={projectUrl}
              selectedTaskId={selectedTaskId}
              tasks={filteredTasks}
              onSelectTask={this.onSelectTask}
              onLabelClick={this.onLabelClick}
              onClearFilters={this.onClearFilters}
            />
            {/*<TaskList*/}
            {/*history={this.props.history}*/}
            {/*location={this.props.location}*/}
            {/*tasks={filteredTasks}*/}
            {/*selectedTaskId={selectedTaskId}*/}
            {/*selectedProject={selectedProject}*/}
            {/*projectUrl={projectUrl}/>*/}
          </div>
        </div>
      </div>
    );
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
  deleteTask: PropTypes.func.isRequired,
  assignTask: PropTypes.func.isRequired,
  tasks: PropTypes.instanceOf(List).isRequired,
  unloadTasks: PropTypes.func.isRequired,
  unloadComments: PropTypes.func.isRequired,
  loadComments: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  setMenuOpen: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

//=====================================
//  CONNECT
//-------------------------------------
const mapStateToProps = (state) => {
  const selectedProject =  state.projects.selectedProject;
  return{
    auth: state.auth,
    tasks: state.tasks.list,
    filteredTasks: state.tasks.filteredList,
    selectedProjectUserPermissions: state.projects.selectedProjectUserPermissions,
    selectedProject: selectedProject,
    labels:
      selectedProject && selectedProject.popularTags
        ? Object.keys(selectedProject.popularTags)
        : null,
    filters: taskFilters,
    selectedFilters: state.tasks.selectedFilters,
    setFilters: tasksActions.setFilters,
    setFilteredTasks: tasksActions.setFilteredTasks,
    buildFilter: buildFilter,
    setTour: userInterfaceActions.setTour,
    tour: state.userInterface.tour
  };
};

const mapDispatchToProps = Object.assign(
  {},
  tasksActions,
  commentsActions,
  notificationActions,
  labelActions,
  projectActions,
  authActions,
  userInterfaceActions
);

export default connect(mapStateToProps, mapDispatchToProps)(TasksPage);
