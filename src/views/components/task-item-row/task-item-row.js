import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './task-item-row.css';
import Img from 'react-image';
import ReactTooltip from 'react-tooltip'
import Icon from '../icon';
import { connect } from 'react-redux';
import { I18n } from 'react-i18next';

export class TaskItemRow extends Component {
  constructor() {
    super(...arguments);

    this.state = {};

    this.select = this.select.bind(this);
    this.renderLabel = this.renderLabel.bind(this);
  }

  select() {
    this.props.selectTask(this.props.task);
  }

  render() {
    const { task } = this.props;

    let containerClasses = classNames('task-item-row', {
      'task-item--completed': task.completed,
    }, {'is-active': this.props.isActive});


    return (
      <I18n ns='translations'>
      {
      (t, { i18n }) => (
        // Removed tab index as it causes error in the active task when switching between fields
        <div className={containerClasses} /* tabIndex={this.props.taskNumber+100} */
          onClick={this.select}
          onKeyUp={this.select}>
          { task && task.isCritical ?
            <div className='cell'>
              <Icon name='warning' className='warning grow' />
            </div>
          : ''
          }
          <div className='cell'>
            {this.renderTitle(task, t)}
          </div>

          <div className='cell'>
            {this.renderAssignee(task)}
          </div>

          <div className='cell label-cell'>
            {this.renderLabel(task)}
          </div>
        </div>
      )}
      </I18n>
    );
  }


  renderTitle(task, translate) {
    let classNames = 'task-item-title';
    if (task.isDone) {
      classNames += ' is-done';
    }

    return (
      <div className={classNames}>
        {task.title && task.title !== '' ?
         task.title :
        <span className='new-task'>{translate('task.unnamed-task')}</span>}
      </div>
    );
  }

  renderAssignee(task) {
    if (!task.assignee) return;
    const avatar = task.assignee.photoURL ? <Img className='avatar' src={task.assignee.photoURL} alt={task.assignee.name}/> : '';
    return (
      <div className='task-item-assignee' data-tip={task.assignee.name} data-for='task-assignee-tooltip'>
        <ReactTooltip id='task-assignee-tooltip' type='light' effect='solid'/>
        { avatar }
      </div>
    );
  }

  renderLabel(task) {
    if(!task.label || (Object.keys(task.label).length === 0 && task.label.constructor === Object)) {
      return null;
    }
    const labels = (this.props.selectedProject && this.props.selectedProject.popularTags)?  this.props.selectedProject.popularTags : [];
    return (
      <div>
        {
          Object.keys(task.label).map((label) => {
            const bg = labels[label] ? labels[label] : '999';
            return (<span key={label} style={{'backgroundColor': `#${bg}` }} className='label-default'>{label}</span>)
          }) }
      </div>
    );
  }
}

TaskItemRow.propTypes = {
  task: PropTypes.object.isRequired,
  selectTask: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  selectedProject: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {}
};

export default connect(
  mapStateToProps,
  {}
)(TaskItemRow);
