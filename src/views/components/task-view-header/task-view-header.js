import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../button';
import Icon from '../icon';
import Img from 'react-image';

import './task-view-header.css';

export class TaskViewHeader extends Component {
  render() {
    const { task } = this.props;

    const isTaskEmpty = task && (!task.description || task.description == '') &&
    (!task.circle || task.circle == '') && (!task.status || task.status == '');
    const isTaskNew = (!task.title || task.title == '');
    
    return(
      <div className='task-view-header' name='task-view-header'>
      
        <Button className='button-no-border close-button' onClick={ () => this.props.selectTask() }>
          <Icon name='close' className='close-icon grow' />
        </Button>

        {!task.assignee ? <Button
          className='button button-small action-button assign_task'
          onClick={()=>this.props.assignTask(task)}
          type='button'>קחי אחראיות על משימה זו</Button> : 
          
          <div className='avatar-container'>
            <Img className='avatar' src={task.assignee.photoURL}/>
            <span>{task.assignee.name}</span>
          </div>}
            
          { isTaskEmpty && this.props.canDeleteTask ?
          <Button
            className='action-button button-grey'
            onClick={()=> { this.props.removeTask(task); this.props.selectTask(); }}
            type='button'>מחק משימה</Button> : '' }
          
          { task && task.isCritical ? 
            <span>
              <Icon name='warning' className='header-icon grow' />
              משימה קריטית לקיום הארוע
            </span>
          : ''
          }
          { isTaskNew ? 
            <span>
              <Icon name='warning' className='header-icon grow' />
              אנא הכנסי את שם המשימה
            </span>
          : ''
          }
      </div>
    )
  };
}

TaskViewHeader.propTypes = {
  selectTask: PropTypes.func.isRequired,
  assignTask: PropTypes.func.isRequired,
  removeTask: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
  canDeleteTask: PropTypes.bool.isRequired
};


export default TaskViewHeader;
