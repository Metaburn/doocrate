import React, { Component }  from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import TaskItem from '../task-item/task-item';

import './task-list.css';
import Button from '../button';
import InfiniteScroll from 'react-infinite-scroller';
import { I18n } from 'react-i18next';
class TaskList extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      pageSize: 20,
      pageNumber: 0,
    };

    this.loadMore = this.loadMore.bind(this);
  }

  static propTypes = {
    tasks: PropTypes.instanceOf(List).isRequired,
    selectTask: PropTypes.func.isRequired,
    selectedTaskId: PropTypes.string.isRequired,
    createTask: PropTypes.func.isRequired,
  };



  loadMore(pageNumber) {
    this.setState({
      pageNumber,
    })
  }

  render() {
    const isAnyTasks = this.props.tasks && this.props.tasks.size > 0;
    let taskItems = [];
    let selectedTaskId = this.props.selectedTaskId;
    if (isAnyTasks) {
      taskItems = this.props.tasks.slice(
        0,
        this.state.pageSize * (this.state.pageNumber + 1))
        .map((task, index) => {
          let isActive = task.get('id') === selectedTaskId;
          return (
            <TaskItem
              key={index}
              taskNumber={index}
              task={task}
              selectTask={this.props.selectTask}
              isActive={isActive}
            />
          );
      });
    }

  const hasMoreTasks = this.props.tasks?
    (this.state.pageSize * this.state.pageNumber) < this.props.tasks.size : true
    return (
      <I18n ns='translations'>
        {
        (t, { i18n }) => (
        <div className='task-list-container'>
          <div className='task-list-header' name='task-list-header'>
            <Button
              className="button button-small add-task-button"
              onClick={ this.props.createTask }>
              {t(`task.add-task`)}
            </Button>
          </div>

          <div className='task-list'>
          <InfiniteScroll
              pageStart={0}
              loadMore={this.loadMore}
              hasMore={hasMoreTasks}
              useWindow={false}
              loader={<div className="loader">{t('general.loading')}</div>}>
              { taskItems }
          </InfiniteScroll>
          </div>
        </div>
      )}
      </I18n>
    );
  }

}

export default TaskList;
