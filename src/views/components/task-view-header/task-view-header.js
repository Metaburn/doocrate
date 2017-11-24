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

    const isTaskEmpty = task && (!task.description || task.description === '') &&
    (!task.circle || task.circle === '') && (!task.status || task.status === '');

    return(
      <I18n ns='translations'>
      {
      (t, { i18n }) => (
        <div className='task-view-header' name='task-view-header'>

          <Button className='button-no-border close-button' onClick={ () => this.props.selectTask() }>
            <Icon name='close' className='close-icon grow' />
          </Button>

          {!task.assignee ? <Button
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

            { isTaskEmpty && this.props.canDeleteTask ?
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
  showUnassignButton: PropTypes.bool.isRequired
};


export default TaskViewHeader;
