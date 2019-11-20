import React, { Component } from 'react';
import TaskView from './task-view';
import { slide as Menu } from 'react-burger-menu';
import { isMobile, isTablet } from '../../../utils/browser-utils';
import classnames from 'classnames';
import i18n from 'src/i18n';

class TaskSideView extends Component {
  constructor() {
    super();
    this.isSaved = false;
  }

  render() {
    const {
      selectedTask,
      onDeleteTask,
      updateTask,
      assignTask,
      selectedProject,
      isAdmin,
      isGuide,
      followTask,
      unfollowTask,
      unassignTask,
      unloadComments,
      createComment,
      updateComment,
      removeComment,
      isValidCallback,
      isDraft,
      submitNewTask,
      resetSelectedTask,
      validations,
      userPermissions,
    } = this.props;

    const isHebrew = i18n.language === 'he';
    const width = isMobile ? '98%' : isTablet ? '60%' : '45%';
    const isOpen = selectedTask !== undefined || isDraft;
    const classNames = classnames('task-side-view', {
      'is-mobile': isMobile,
      'right-menu': isHebrew,
      'left-menu': !isHebrew,
    });

    return (
      <Menu
        right={!isHebrew}
        isOpen={isOpen}
        className={classNames}
        overlayClassName={'task-side-view-overlay'}
        disableOverlayClick={() => {
          if (isDraft && !this.isSaved) {
            this.isSaved = false;
            return !window.confirm(i18n.t('task.confirm-exit'));
          }
          return false;
        }}
        onStateChange={state => {
          if (state.isOpen && this.isSaved) {
            // reset isSaved on open
            this.isSaved = false;
          }
          return !state.isOpen && resetSelectedTask();
        }}
        width={width}
      >
        <TaskView
          onDeleteTask={onDeleteTask}
          updateTask={updateTask}
          selectedTask={selectedTask}
          selectedProject={selectedProject}
          isAdmin={isAdmin}
          isGuide={isGuide}
          assignTask={assignTask}
          followTask={followTask}
          unfollowTask={unfollowTask}
          unassignTask={unassignTask}
          unloadComments={unloadComments}
          createComment={createComment}
          updateComment={updateComment}
          removeComment={removeComment}
          isValidCallback={isValidCallback}
          isDraft={isDraft}
          submitNewTask={task => {
            this.isSaved = true;
            submitNewTask(task);
          }}
          closeTaskView={() => {
            if (isDraft && !this.isSaved) {
              if (window.confirm(i18n.t('task.confirm-exit'))) {
                resetSelectedTask();
                this.isSaved = false;
              } else {
                return;
              }
            }
            resetSelectedTask();
          }}
          validations={validations}
          userPermissions={userPermissions}
        />
      </Menu>
    );
  }
}
export default TaskSideView;
