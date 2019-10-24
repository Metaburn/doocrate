import React, { Component }  from 'react';
import { Link } from 'react-router-dom';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import TaskItem from '../task-item-row/task-item-row';
import InfiniteScroll from 'react-infinite-scroller';
import i18n from '../../../i18n';
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
    this.props.history.push({search: ''});
  };

  render() {
    const { tasks, selectedTaskId, selectedProject, labels, projectUrl } = this.props;
    const { pageSize, pageNumber } = this.state;
    const isAnyTasks = tasks && tasks.size > 0;
    let taskItems = [];

    if (isAnyTasks) {
      taskItems = tasks.slice(0, pageSize * (pageNumber + 1))
        .map((task, index) => {
          const taskId = task.get('id');
          const isActive = taskId === selectedTaskId;
          const taskRoute = `/${projectUrl}/task/${taskId}`;

          return (
            <Link to={taskRoute} key={index}>
              <TaskItem
                taskNumber={index}
                task={task}
                selectedProject={selectedProject}
                labels={labels}
                isActive={isActive}/>
            </Link>
          );
      });
    }

    const hasMoreTasks = tasks ? (pageSize * pageNumber) < tasks.size : true;

    return (
      <div className="task-list-container">
        <div className="task-list-header" name="task-list-header">
          <CompleteFilter projectUrl={projectUrl}/>
        </div>

        <div className="task-list">
          {/* Suggest to remove filters */}
          {!isAnyTasks &&
            (getUrlSearchParams()['complete'] !== undefined) &&
              <div className="no-tasks-placeholder">
                <h3>
                  {i18n.t('task.no-tasks-found')}
                  <div>
                    <button className={`click-here-${i18n.t('lang-float')}`} onClick={this.clearSearchQuery}>{i18n.t('task.click-here')}</button>
                    {i18n.t('task.no-tasks-placeholder2')}
                  </div>
                </h3>
              </div>}

          <InfiniteScroll
              pageStart={0}
              loadMore={this.loadMore}
              hasMore={hasMoreTasks}
              useWindow={false}
              loader={<div className="loader">{i18n.t('general.loading')}</div>}>
              { taskItems }
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

TaskList.propTypes = {
  tasks: PropTypes.instanceOf(List).isRequired,
  selectedTaskId: PropTypes.string,
  selectedProject: PropTypes.object,
  projectUrl: PropTypes.string.isRequired
};

export default TaskList;
