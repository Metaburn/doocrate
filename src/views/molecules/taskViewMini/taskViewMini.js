import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-tagsinput/react-tagsinput.css';

import './taskViewMini.css';
import classNames from "classnames";
import UserInfoAvatar from "src/views/atoms/userInfoAvatar";
import LabelsList from "../labelsList/labelsList";
import userCircleSolid from "./user-circle-solid.svg";

class TaskViewMini extends Component {

  componentWillReceiveProps(nextProps) {
    this.updateStateByProps(nextProps);
  }

  componentWillMount() {
    this.updateStateByProps(this.props);
  }

  updateStateByProps(props) {

  }

  getDefaultTaskTypes(props) {
    if (props.selectedProject &&
      props.selectedProject.taskTypes &&
      props.selectedProject.taskTypes.length >=5) {
      const taskTypes = props.selectedProject.taskTypes;
      return [
        {value: 1, label: taskTypes[0]},
        {value: 2, label: taskTypes[1]},
        {value: 3, label: taskTypes[2]},
        {value: 4, label: taskTypes[3]},
        {value: 5, label: taskTypes[4]}
      ];
    }
  }

  selectedTaskType(selected, fieldName) {
    let val = null;

    if (selected) { val = selected; }

    this.setState({ [fieldName]: val });
  }

  render() {
    const {task,i18n} = this.props;

    if (!task) {
      return (
        <div className="task-view-mini">
          <h1>&nbsp;</h1>
        </div>
      );
    }

    const {title, description, label, requirements, type} = task;
    let containerClasses = classNames('task-view-mini',
      {'active': this.props.isActive},
      `lang-${i18n.language}`);

    const labelAsArray = label ?
      (Object.keys(label).map(l => {
        return l
      })) : [];

    return (
      <div className={containerClasses} dir={i18n.t('lang-dir')}
           onClick={() => this.props.onSelectTask(this.props.task)}>
        <div className={'header'}>
          <div className={'title'}>{title}</div>
          <div className={`task-type`}>{type && type.label}</div>
        </div>
        <div>{description}</div>
        <div>{requirements}</div>

        { this.renderAssignee() }

        <div className={`tags-container lang-${this.props.i18n.language}`}>
          {this.renderLabels(labelAsArray, false, '0')}
        </div>

      </div>
    );
  }

  renderLabels(labels) {
    return (
      <LabelsList
        labels={labels}
        onLabelClick={this.props.onLabelClick}/>
    );
  }

  renderAssignee = () => {
    const {assignee} = this.props.task;
    if(!assignee) {
      return (
        <div className={`avatar-container lang-${this.props.i18n.language}`}>
          <img src={userCircleSolid} alt={'Assignee'}/>
          <span>{this.props.i18n.t('task.no-assignee')}</span>
        </div>
      )
    }

    return(
      <div className={`avatar-container lang-${this.props.i18n.language}`}>
        <UserInfoAvatar
          uniqueId={'task-header-assignee'}
          photoURL={assignee.photoURL}
          userId={assignee.id}
          alt={assignee.name}/>
        <span>{assignee.name}</span>
      </div>
    );
  }

}

TaskViewMini.propTypes = {
  onSelectTask: PropTypes.func.isRequired,
  onLabelClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  task: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
};

export default TaskViewMini
