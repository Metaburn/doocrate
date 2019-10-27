import React, {Component} from 'react';
import PropTypes from 'prop-types';
import 'react-tagsinput/react-tagsinput.css';

import './myTasks.css';
import TaskViewMiniList from "../taskViewMiniList/taskViewMiniList";

class MyTasks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCreatedTasks: true,
      showAssignedTasks: true
    }
  }

  render() {
    //TODO - Performance wise - This should probably be in the reducer and not in render
    // Includes task I've created and assigned
    const { auth, tasks, buildFilter, taskFilters } = this.props;
    const myTasksFilter = buildFilter(auth, 'user', auth.id);
    const myTasks = taskFilters[myTasksFilter.type](tasks, myTasksFilter);

    const myTasksFilterOnlyCreator = buildFilter(auth, 'userOnlyCreator', auth.id);
    const myTasksOnlyCreator = taskFilters[myTasksFilterOnlyCreator.type](myTasks, myTasksFilter);
    const myTasksFilterOnlyAssignee = buildFilter(auth, 'userOnlyAssignee', auth.id);
    const myTasksOnlyAssignee = taskFilters[myTasksFilterOnlyAssignee.type](myTasks, myTasksFilter);

    let tasksToShow;
    if (this.state.showAssignedTasks && this.state.showCreatedTasks) {
      tasksToShow = myTasks;
    } else if (this.state.showAssignedTasks) {
      tasksToShow = myTasksOnlyAssignee;
    } else if (this.state.showCreatedTasks) {
      tasksToShow = myTasksOnlyCreator;
    }

    return (
      <div className={'my-tasks'}>
        <span> {tasksToShow.size} </span>

        <button className={'button-as-link'} onClick={this.showAll}>Show All</button>
        <button className={'button-as-link'} onClick={this.onlyShowCreated}>Only Created</button>
        <button className={'button-as-link'} onClick={this.onlyShowAssigned}>Only Assigned</button>

        <TaskViewMiniList
          i18n={this.props.i18n}
          onSelectTask={this.props.onSelectTask}
          onLabelClick={this.props.onLabelClick}
          tasks={tasksToShow}
          selectedTaskId={1000}
          /*
          TODO - This should be set in the store (Maybe in the ui store or tasks store)
          selectedTaskId={this.state.selectedTask? this.state.selectedTask.get("id") : ""}*/
        />
      </div>
    )
  }

  onlyShowCreated = () => {
    this.setState({
      showAssignedTasks: false,
      showCreatedTasks: true
    });
  };

  onlyShowAssigned = () => {
    this.setState({
      showAssignedTasks: true,
      showCreatedTasks: false
    });
  };

  showAll = () => {
    this.setState({
      showAssignedTasks: true,
      showCreatedTasks: true
    });
  };

}

MyTasks.propTypes = {
  i18n: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  tasks: PropTypes.array.isRequired,
  selectedProject: PropTypes.object.isRequired,
  taskFilters: PropTypes.object.isRequired,
  buildFilter: PropTypes.func.isRequired,
  onLabelClick: PropTypes.func.isRequired,
  onSelectTask: PropTypes.func.isRequired
};

export default MyTasks
