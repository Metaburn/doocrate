import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TaskViewMiniList from "../taskViewMiniList/taskViewMiniList";

import 'react-tagsinput/react-tagsinput.css';
import './myTasks.css';

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
    const { auth, tasks, buildFilter, taskFilters, i18n } = this.props;
    const myTasksFilter = buildFilter(auth, 'user', auth.id);
    const myTasks = taskFilters[myTasksFilter.type](tasks, myTasksFilter);

    const myTasksFilterOnlyCreator = buildFilter(auth, 'userOnlyCreator', auth.id);
    const myTasksOnlyCreator = taskFilters[myTasksFilterOnlyCreator.type](myTasks, myTasksFilter);
    const myTasksFilterOnlyAssignee = buildFilter(auth, 'userOnlyAssignee', auth.id);
    const myTasksOnlyAssignee = taskFilters[myTasksFilterOnlyAssignee.type](myTasks, myTasksFilter);

    let tasksToShow;

    const {showAssignedTasks, showCreatedTasks } = this.state;

    if (showAssignedTasks && showCreatedTasks) {
      tasksToShow = myTasks;
    } else if (showAssignedTasks) {
      tasksToShow = myTasksOnlyAssignee;
    } else if (showCreatedTasks) {
      tasksToShow = myTasksOnlyCreator;
    }

    const baseClasses = 'button button-small';
    const classShowAll = classNames(baseClasses, {'active': showAssignedTasks && showCreatedTasks});
    const classOnlyAssignee = classNames(baseClasses, {'active': showAssignedTasks && !showCreatedTasks});
    const classOnlyCreated = classNames(baseClasses, {'active': showCreatedTasks && !showAssignedTasks});

    return (
      <div className={'my-tasks'}>

        <button className={classShowAll} onClick={this.showAll}>{i18n.t('my-space.show-all')}</button>
        <button className={classOnlyAssignee} onClick={this.onlyShowAssigned}>{i18n.t('my-space.only-assigned')}</button>
        <button className={classOnlyCreated} onClick={this.onlyShowCreated}>{i18n.t('my-space.only-created')}</button>

        {<h2 className={'tasks-counter'}>{i18n.t('task.showing-x-tasks',{count: tasksToShow.size})}</h2>}

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
