import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import Button from '../button';
import Icon from '../../atoms/icon';
import Img from 'react-image';
import { I18n } from 'react-i18next';
import UserInfoAvatar from "../../atoms/userInfoAvatar/userInfoAvatar";

import follow from './follow.png';
import './task-view-header.css';
import TaskHeaderTooltip from "../../molecules/TaskHeaderTooltip/taskHeaderTooltip";

export class TaskViewHeader extends Component {
  render() {
    const { task, isDraft, isShowDeleteButton, isShowMarkAsDoneButton,
      isShowUnassignButton, showButtonAsFollow, isShowSaveButton,
      closeTaskView,assignTask, onUnassignTask, saveTask, projectUrl,
      isShowEditButton, onEditTask, markAsDoneUndone, onDeleteTask, userPermissions} = this.props;
    const assignee = task? task.assignee : {};

    return(
      <I18n ns='translations'>
      {
      (t, { i18n }) => (
        <div className='task-view-header' name='task-view-header'>

          <div className={'task-view-header-actions'}>

            <button onClick={closeTaskView} className="button-no-border close-button">
              <Icon name="close" className="close-icon grow"/>
            </button>

            {!isDraft && isShowEditButton &&
            <button onClick={onEditTask} className="button button-small action-button">
              <Icon name={"edit"} className={"header-icon grow"}/>
            </button>
            }

            { isShowSaveButton && ! isDraft &&
            <Button
              className='button button-small action-button'
              onClick={()=> { saveTask() }}
              type='button'>{t('task.save')}</Button>
            }

            { !isDraft ?
              (showButtonAsFollow ?
                <Button className='button button-small action-button'
                        onClick={() => this.props.followTask(task)}
                        alt={t('follow-task-alt')}>
                  <span>{t('task.follow-task')}</span>
                  <Img className='follow-icon' src={follow}/>
                </Button>
                :
                <Button className='button button-small action-button'
                        onClick={() => this.props.unfollowTask(task)}
                        alt={t('follow-task-alt')}>
                  <span>{t('task.unfollow-task')}</span>
                  <Img className='follow-icon' src={follow}/>
                </Button>
              ): ''
            }

            { task && task.isCritical &&
              <span>
                <Icon name='warning' className='header-icon grow' />
                {t('task.critical')}
              </span>
            }
          </div>

          <div className={`task-header-tooltip-wrapper lang-${i18n.language}`}>

            {isDraft || userPermissions.canAssign === false ? '' : (!assignee) ?
              <Fragment>
                <Button
                  className={`button button-small action-button assign_task lang-${i18n.language}`}
                  onClick={()=>assignTask(task)}
                  type='button'>
                  <span>
                    {i18n.t('task.take-responsibility')}
                  </span>
                </Button>
              </Fragment>
              :

              <div className='avatar-container'>
                <UserInfoAvatar
                  uniqueId={'task-header-assignee'}
                  photoURL={assignee.photoURL}
                  userId={assignee.id}
                  alt={assignee.name}
                  projectUrl={projectUrl} />
              </div>}

            { !isDraft &&
              <TaskHeaderTooltip
                isShowMarkAsDoneButton={isShowMarkAsDoneButton}
                isIconDoneUndone={task && task.isDone}
                isShowDeleteButton={isShowDeleteButton}
                isShowUnassignButton={isShowUnassignButton}
                onSetAsDoneUndone={() => markAsDoneUndone(task)}
                onDeleteTask={() => onDeleteTask(task)}
                onUnassignTask={() => onUnassignTask(task)}/> }
          </div>

        </div>
      )}
      </I18n>
    )
  };


}

TaskViewHeader.propTypes = {
  assignTask: PropTypes.func.isRequired,
  followTask: PropTypes.func.isRequired,
  unfollowTask: PropTypes.func.isRequired,
  onUnassignTask: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
  canDeleteTask: PropTypes.bool.isRequired,
  isShowEditButton: PropTypes.bool.isRequired,
  isShowSaveButton: PropTypes.bool.isRequired,
  isShowUnassignButton: PropTypes.bool,
  isShowMarkAsDoneButton: PropTypes.bool.isRequired,
  isShowDeleteButton: PropTypes.bool.isRequired,
  showButtonAsFollow: PropTypes.bool.isRequired,
  isDraft: PropTypes.bool.isRequired,
  saveTask: PropTypes.func.isRequired,
  projectUrl: PropTypes.string.isRequired,
  markAsDoneUndone: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  closeTaskView: PropTypes.func.isRequired,
};

export default TaskViewHeader;
