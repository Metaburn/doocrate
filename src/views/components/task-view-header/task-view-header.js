import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../button';
import Icon from '../icon';
import Img from 'react-image';
import { I18n } from 'react-i18next';

import './task-view-header.css';

export class TaskViewHeader extends Component {
  render() {
    const { task } = this.props;

    return(
      <I18n ns='translations'>
      {
      (t, { i18n }) => (
        <div className='task-view-header' name='task-view-header'>

          <Button className='button-no-border close-button' onClick={ () => this.props.selectTask() }>
            <Icon name='close' className='close-icon grow' />
          </Button>

          {this.props.isDraft ? '' : !task.assignee ? <Button
            className='button button-small action-button assign_task'
            onClick={()=>this.props.assignTask(task)}
            type='button'>{t('task.take-responsibility')}</Button> :


            <div className='avatar-container'>
              <Img className='avatar' src={task.assignee.photoURL}/>
              <span>{task.assignee.name}</span>
            </div>}

          { this.props.showUnassignButton && task.assignee ?
            <Button
            className='action-button button-grey'
            onClick={()=> { this.props.unassignTask(task)}}
            type='button'>{t('task.remove-responsibility')}</Button> : ''
          }

          { this.props.showSaveButton ?
          <Button
            className='button button-small action-button assign_task'
            onClick={()=> { this.props.saveTask() }}
            type='button'>{t('task.save')}</Button> : ''
          }

          { this.props.showSaveButton ?
            <Button
              className='button button-small action-button'
              onClick={()=> { this.props.markAsDoneUndone() }}
              type='button'>{ task.isDone? t('task.mark-uncomplete') : t('task.mark-complete')}</Button> : ''
          }

          { this.props.showDeleteButton ?
            <Button
              className='action-button button-grey'
              onClick={()=> { this.props.removeTask(task); this.props.selectTask(); }}
              type='button'>{t('task.delete')}</Button> : '' }

          { task && task.isCritical ?
            <span>
              <Icon name='warning' className='header-icon grow' />
              {t('task.critical')}
            </span>
          : ''
          }

        </div>
      )}
      </I18n>
    )
  };
}

TaskViewHeader.propTypes = {
  selectTask: PropTypes.func.isRequired,
  assignTask: PropTypes.func.isRequired,
  unassignTask: PropTypes.func.isRequired,
  removeTask: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
  canDeleteTask: PropTypes.bool.isRequired,
  showUnassignButton: PropTypes.bool.isRequired,
  showSaveButton: PropTypes.bool.isRequired,
  showDeleteButton: PropTypes.bool.isRequired,
  isDraft: PropTypes.bool.isRequired,
  saveTask: PropTypes.func.isRequired,
  markAsDoneUndone: PropTypes.func.isRequired
};


export default TaskViewHeader;
