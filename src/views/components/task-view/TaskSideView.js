import React from 'react';
import OffCanvas from 'react-aria-offcanvas';
import TaskView from './task-view';
import { isMobile, isTablet } from '../../../utils/browser-utils';

const TaskSideView = ({
  i18n, selectedTask, removeTask, updateTask,
  assignTask, selectedProject, isAdmin, isGuide,
  followTask, unfollowTask, unassignTask, unloadComments,
  createComment, updateComment, removeComment,
  isValidCallback, isDraft, submitNewTask, resetSelectedTask
}) => {

  const isHebrew = i18n.language === 'he';
  const position = isMobile ? 'bottom' : isHebrew ? 'left' : 'right';
  const width = isMobile ? '90%' : isTablet? '60%' :'50%';
  const isOpen = !!selectedTask || isDraft;

  return (
    <OffCanvas
      overlayClassName="task-side-view-overlay"
      className="task-side-view"
      position={position}
      height="100%"
      width={width}
      closeOnOverlayClick={true}
      isOpen={isOpen}
      onClose={resetSelectedTask}>

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
    </OffCanvas>
  );
};

export default TaskSideView;
