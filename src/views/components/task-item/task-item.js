import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './task-item.css';
import Img from 'react-image';
import ReactTooltip from 'react-tooltip'
import Icon from '../icon';
import { connect } from 'react-redux';
import { I18n } from 'react-i18next';

export class TaskItem extends Component {
  constructor() {
    super(...arguments);

    this.state = {};

    this.select = this.select.bind(this);
  }

  select() {
    this.props.selectTask(this.props.task);
  }

  render() {
    const { task } = this.props;

    let containerClasses = classNames('task-item', {
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
      <div className='task-item-assignee' data-tip={task.assignee.name}>
        <ReactTooltip type='light' effect='solid'/>
        { avatar }
      </div>
    );
  }

  renderLabel(task) {
    if(!task.label || (Object.keys(task.label).length === 0 && task.label.constructor === Object)) {
      return null;
    }
    return (
      <div>
        {
          Object.keys(task.label).map((label) => {
            const bg = this.props.labels[label] ? this.props.labels[label].colorInHex : '999';
            return (<span key={label} style={{'backgroundColor': `#${bg}` }} className='label-default'>{label}</span>)
          }) }
      </div>
    );
  }
}

TaskItem.propTypes = {
  task: PropTypes.object.isRequired,
  selectTask: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  labels: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    labels: state.labels.toJS()
  }
};

export default connect(
  mapStateToProps,
  {}
)(TaskItem);
