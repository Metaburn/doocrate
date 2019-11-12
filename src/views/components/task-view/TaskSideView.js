import React from "react";
import TaskView from "./task-view";
import { slide as Menu } from "react-burger-menu";
import { isMobile, isTablet } from "../../../utils/browser-utils";
import classnames from "classnames";
import i18n from "src/i18n";

const TaskSideView = ({
  selectedTask, onDeleteTask, updateTask,
  assignTask, selectedProject, isAdmin, isGuide,
  followTask, unfollowTask, unassignTask, unloadComments,
  createComment, updateComment, removeComment,
  isValidCallback, isDraft, submitNewTask, resetSelectedTask, validations, userPermissions
}) => {

  const isHebrew = i18n.language === "he";
  const width = isMobile ? "98%" : isTablet? "60%" :"45%";
  const isOpen = selectedTask !== undefined || isDraft;
  const classNames = classnames("task-side-view",
    { "is-mobile": isMobile,
      "right-menu": isHebrew,
      "left-menu": !isHebrew});

  return (

    <Menu right={!isHebrew}
          isOpen={isOpen}
          className={classNames}
          overlayClassName={"task-side-view-overlay"}
          disableOverlayClick={()=>{
           /* if(isDraft){
              return !window.confirm(i18n.t('task.confirm-exit'))
            }*/
            return false;
          }}
          onStateChange={(state) => (!state.isOpen && resetSelectedTask())}
          width={ width }>

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
        submitNewTask={submitNewTask}
        closeTaskView={()=>{
          /*if(isDraft) {
            if (window.confirm(i18n.t('task.confirm-exit'))) {
              resetSelectedTask()
            }else {
              return;
            }
          }*/
          resetSelectedTask()
        }}
        validations={validations}
        userPermissions={userPermissions}/>
    </Menu>
  );
};

export default TaskSideView;
