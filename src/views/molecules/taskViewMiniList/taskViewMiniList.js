import React, {Component} from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import i18n from 'src/i18n';

import './taskViewMiniList.css';
import TaskViewMini from "../taskViewMini/taskViewMini";
import MeEmptyPlaceholder from "../meEmptyPlaceholder/meEmptyPlaceholder";
import EmptyPlaceholder from "../emptyPlaceholder/emptyPlaceholder";

class TaskViewMiniList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageSize: 20,
      pageNumber: 0,
    };

    this.loadMore = this.loadMore.bind(this);
  }

  loadMore(pageNumber) {
    this.setState({pageNumber});
  }

  render() {
    const {tasks, selectedTaskId, onSelectTask, onLabelClick,
      projectUrl, setTour} = this.props;
    const {pageSize, pageNumber} = this.state;
    const isAnyTasks = tasks && tasks.size > 0;

    let taskItems = [];

    if (isAnyTasks) {
      taskItems = tasks.slice(0, pageSize * (pageNumber + 1))
        .map((task, index) => {
          const isActive = task.get('id') === selectedTaskId;

          return (
            <TaskViewMini
              key={index}
              task={task}
              onSelectTask={onSelectTask}
              onLabelClick={onLabelClick}
              isActive={isActive}
              projectUrl={projectUrl}/>
          );
        });
    }

    const hasMoreTasks = tasks ? (pageSize * pageNumber) < tasks.size : true;

    return (
      <div className="task-view-mini-list">
        {(!isAnyTasks &&
          <div className={'me-empty-placeholder-wrapper'}>
            {this.props.shouldShowWizardOnNoResults ?
              <MeEmptyPlaceholder
                projectUrl={projectUrl}
                setTour={setTour}/>

              :
              <EmptyPlaceholder onClearFilters={this.props.onClearFilters}/>
            }
          </div>
        )}

        {(isAnyTasks &&
          <InfiniteScroll
            className={'task-view-mini-container'}
            pageStart={0}
            loadMore={this.loadMore}
            hasMore={hasMoreTasks}
            useWindow={true}
            loader={<div className="loader">{i18n.t('general.loading')}</div>}>
            {taskItems}
          </InfiniteScroll>
        )}
      </div>)
  }
}

TaskViewMiniList.propTypes = {
  tasks: PropTypes.array.isRequired,
  onSelectTask: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func,
  onLabelClick: PropTypes.func.isRequired,
  setTour: PropTypes.func.isRequired,
  selectedTaskId: PropTypes.string,
  shouldShowWizardOnNoResults: PropTypes.bool.isRequired,
  projectUrl: PropTypes.string.isRequired,
};

export default TaskViewMiniList;
