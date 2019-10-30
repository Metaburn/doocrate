import React from 'react';
import TaskView from './task-view';
import { slide as Menu } from 'react-burger-menu';
import { isMobile, isTablet } from '../../../utils/browser-utils';
import classnames from "classnames";

const TaskSideView = ({
  i18n, selectedTask, removeTask, updateTask,
  assignTask, selectedProject, isAdmin, isGuide,
  followTask, unfollowTask, unassignTask, unloadComments,
  createComment, updateComment, removeComment,
  isValidCallback, isDraft, submitNewTask, resetSelectedTask
}) => {

  const isHebrew = i18n.language === "he";
  const width = isMobile ? "90%" : isTablet? "60%" :"50%";
  const isOpen = selectedTask || isDraft;
  const classNames = classnames("task-side-view",
    { "is-mobile": isMobile,
      "right-menu": isHebrew,
      "left-menu": !isHebrew});

  return (

    <Menu right={!isHebrew}
          isOpen={isOpen}
          className={classNames}
          overlayClassName={"task-side-view-overlay"}
          disableOverlayClick={false}
          onStateChange={(state) => (!state.isOpen && resetSelectedTask())}
          width={ width }>

      <TaskView
        removeTask={removeTask}
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
        submitNewTask={submitNewTask}
        closeTaskView={resetSelectedTask}/>
    </Menu>
  );
};

export default TaskSideView;
