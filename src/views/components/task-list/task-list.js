import React, { Component }  from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import TaskItem from '../task-item-row/task-item-row';
import Button from '../button';
import InfiniteScroll from 'react-infinite-scroller';
import { I18n } from 'react-i18next';
import CompleteFilter from '../complete-filter';
import { getUrlSearchParams } from 'src/utils/browser-utils.js';
import './task-list.css';

class TaskList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageSize: 20,
      pageNumber: 0,
    };

    this.loadMore = this.loadMore.bind(this);
  }

  loadMore(pageNumber) {
    this.setState({ pageNumber });
  }

  clearSearchQuery = () => {
    this.props.history.push('');
  }

  render() {
    const { tasks, selectedTaskId, selectTask, selectedProject, labels, createTask, projectUrl } = this.props;
    const { pageSize, pageNumber } = this.state;
    const isAnyTasks = tasks && tasks.size > 0;
    let taskItems = [];

    if (isAnyTasks) {
      taskItems = tasks.slice(0, pageSize * (pageNumber + 1))
        .map((task, index) => {
          const isActive = task.get('id') === selectedTaskId;

          return (
            <TaskItem
              key={index}
              taskNumber={index}
              task={task}
              selectTask={selectTask}
              selectedProject={selectedProject}
              labels={labels}
              isActive={isActive}/>
          );
      });
    }

    const hasMoreTasks = tasks ? (pageSize * pageNumber) < tasks.size : true;

    return (
      <I18n ns="translations">
        {(t, { i18n }) => (
        <div className="task-list-container">
          <div className="task-list-header" name="task-list-header">
            <Button
              className="button button-small add-task-button"
              onClick={createTask}>
              {t(`task.add-task`)}
            </Button>

            <CompleteFilter projectUrl={projectUrl}/>
          </div>

          <div className="task-list">
            {/* Suggest to remove filters */}
            {!isAnyTasks &&
              (getUrlSearchParams()['complete'] !== undefined) ?
                <div className="no-tasks-placeholder">
                  <h3>{t('task.no-tasks-found')}</h3>
                  <button onClick={this.clearSearchQuery}>{t('task.click-here')}</button>
                  {t('task.no-tasks-placeholder2')}
                </div>
            : ''}

            <InfiniteScroll
                pageStart={0}
                loadMore={this.loadMore}
                hasMore={hasMoreTasks}
                useWindow={false}
                loader={<div className="loader">{t('general.loading')}</div>}>
                { taskItems }
            </InfiniteScroll>
          </div>
        </div>)}
      </I18n>
    );
  }
}

TaskList.propTypes = {
  tasks: PropTypes.instanceOf(List).isRequired,
  selectTask: PropTypes.func.isRequired,
  selectedTaskId: PropTypes.string.isRequired,
  selectedProject: PropTypes.object,
  createTask: PropTypes.func.isRequired,
  projectUrl: PropTypes.string.isRequired
};

export default TaskList;
