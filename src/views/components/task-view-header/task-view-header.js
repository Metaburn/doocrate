import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../button';
import Icon from '../icon';
import Img from 'react-image';
import { I18n } from 'react-i18next';
import UserInfoAvatar from "../../atoms/userInfoAvatar/userInfoAvatar";
import follow from './follow.png';
import './task-view-header.css';

export class TaskViewHeader extends Component {
  render() {
    const { task } = this.props;
    const assignee = task? task.assignee : {};

    return(
      <I18n ns='translations'>
      {
      (t, { i18n }) => (
        <div className='task-view-header' name='task-view-header'>

          <button onClick={this.props.closeTaskView} className="button-no-border close-button">
            <Icon name="close" className="close-icon grow"/>
          </button>

          {this.props.isDraft ? '' : (!assignee) ? <Button
            className='button button-small action-button assign_task'
            onClick={()=>this.props.assignTask(task)}
            type='button'>{t('task.take-responsibility')}</Button> :

            <div className='avatar-container'>
              <UserInfoAvatar
                uniqueId={'task-header-assignee'}
                photoURL={assignee.photoURL}
                userId={assignee.id}
                alt={assignee.name}/>
              <span>{assignee.name}</span>
            </div>}


          { this.props.showUnassignButton && assignee &&
            <Button
            className='action-button button-grey'
            onClick={()=> { this.props.unassignTask(task)}}
            type='button'>{t('task.remove-responsibility')}</Button>
          }

          { this.props.showSaveButton &&
          <Button
            className='button button-small action-button assign_task'
            onClick={()=> { this.props.saveTask() }}
            type='button'>{t('task.save')}</Button>
          }

          { !this.props.isDraft ?
            (this.props.showButtonAsFollow ?
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

          { this.props.showMarkAsDoneButton &&
            <Button
              className='button button-small action-button'
              onClick={()=> { this.props.markAsDoneUndone() }}
              type='button'>{ (task && task.isDone)? t('task.mark-uncomplete') : t('task.mark-complete')}</Button>
          }

          { this.props.showDeleteButton &&
            <Button
              className='button button-small action-button'
              onClick={() => {
                if (!window.confirm(t('task.sure-delete'))) {
                  return;
                }
                this.props.removeTask(task);

                // TODO (Removed selectTask call)
                // Navigate to main page: /${projectUrl}
              }}
              type='button'>
              <Icon name='delete' className='header-icon grow delete'/>
            </Button>
          }

          { task && task.isCritical &&
            <span>
              <Icon name='warning' className='header-icon grow' />
              {t('task.critical')}
            </span>
          }

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
  unassignTask: PropTypes.func.isRequired,
  removeTask: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
  canDeleteTask: PropTypes.bool.isRequired,
  showUnassignButton: PropTypes.bool.isRequired,
  showSaveButton: PropTypes.bool.isRequired,
  showMarkAsDoneButton: PropTypes.bool.isRequired,
  showButtonAsFollow: PropTypes.bool.isRequired,
  showDeleteButton: PropTypes.bool.isRequired,
  isDraft: PropTypes.bool.isRequired,
  selectedProject: PropTypes.object.isRequired,
  saveTask: PropTypes.func.isRequired,
  markAsDoneUndone: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  closeTaskView: PropTypes.func.isRequired,
};

export default TaskViewHeader;
