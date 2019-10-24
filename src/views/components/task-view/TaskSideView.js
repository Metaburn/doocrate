import React from 'react';
import OffCanvas from 'react-aria-offcanvas';
import TaskView from './task-view';
import { isMobile, isTablet } from '../../../utils/browser-utils';

const TaskSideView = ({
  selectedTask, removeTask, updateTask,
  assignTask, selectedProject, isAdmin, isGuide,
  followTask, unfollowTask, unassignTask,
  unloadComments, createComment, updateComment, removeComment,
  isValidCallback, isDraft, submitNewTask, resetSelectedTask
}) => {
  const position = isMobile ? 'bottom' : 'right';
  const isOpen = !!selectedTask;

  return (
    <OffCanvas
      overlayClassName="task-side-view-overlay"
      className="task-side-view"
      position={position}
      height="84%"
      width="50%"
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
        submitNewTask={submitNewTask}/>
    </OffCanvas>
  );
}

export default TaskSideView;
