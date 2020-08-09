import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import UserInfoAvatar from 'src/views/atoms/userInfoAvatar';
import LabelsList from '../labelsList/labelsList';
import i18n from 'src/i18n';
import EmptyAvatar from '../../atoms/emptyAvatar/emptyAvatar';

import 'react-tagsinput/react-tagsinput.css';
import './taskViewMini.css';
import CriticalIcon from '../../atoms/criticalIcon/criticalIcon';

class TaskViewMini extends Component {
  componentWillReceiveProps(nextProps) {
    this.updateStateByProps(nextProps);
  }

  componentWillMount() {
    this.updateStateByProps(this.props);
  }

  updateStateByProps(props) {}

  getDefaultTaskTypes(props) {
    if (
      props.selectedProject &&
      props.selectedProject.taskTypes &&
      props.selectedProject.taskTypes.length >= 5
    ) {
      const taskTypes = props.selectedProject.taskTypes;
      return [
        { value: 1, label: taskTypes[0] },
        { value: 2, label: taskTypes[1] },
        { value: 3, label: taskTypes[2] },
        { value: 4, label: taskTypes[3] },
        { value: 5, label: taskTypes[4] },
      ];
    }
  }

  selectedTaskType(selected, fieldName) {
    let val = null;

    if (selected) {
      val = selected;
    }

    this.setState({ [fieldName]: val });
  }

  render() {
    const { task, isActive } = this.props;

    if (!task) {
      return (
        <div className="task-view-mini">
          <h1>&nbsp;</h1>
        </div>
      );
    }

    const { title, description, label, requirements, type } = task;
    let containerClasses = classNames(
      'task-view-mini',
      { active: isActive },
      `lang-${i18n.language}`,
    );

    const labelAsArray = label
      ? Object.keys(label).map(l => {
          return l;
        })
      : [];

    const { assignee } = task;

    return (
      <div
        className={containerClasses}
        dir={i18n.t('lang-dir')}
        onClick={() => this.props.onSelectTask(task)}
      >
        <div className={'header'}>
          <div className={`title-wrapper lang-${i18n.language}`}>
            {task && task.isCritical && <CriticalIcon showText={false} />}
            <span className={'title'}>{title}</span>
          </div>
          <div className={`task-type lang-${i18n.language}`}>
            {type && type.label}
          </div>
        </div>
        <div className={'description'}>{description}</div>

        {!assignee && <div className={'requirements'}>{requirements}</div>}

        {this.renderAssignee()}

        <div className={`tags-container lang-${i18n.language}`}>
          {this.renderLabels(labelAsArray, false, '0')}
        </div>
      </div>
    );
  }

  renderLabels(labels) {
    return (
      <LabelsList labels={labels} onLabelClick={this.props.onLabelClick} />
    );
  }

  renderAssignee = () => {
    const { task, projectUrl } = this.props;
    const { assignee } = task;

    if (!assignee) {
      return <EmptyAvatar alt={'Assignee'} isShowText={true} />;
    }

    return (
      <div className={`avatar-container lang-${i18n.language}`}>
        <UserInfoAvatar
          uniqueId={'task-header-assignee'}
          photoURL={assignee.photoURL}
          userId={assignee.id}
          alt={assignee.name}
          projectUrl={projectUrl}
        />
        <span>{assignee.name}</span>
      </div>
    );
  };
}

TaskViewMini.propTypes = {
  onSelectTask: PropTypes.func.isRequired,
  onLabelClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  task: PropTypes.object.isRequired,
  projectUrl: PropTypes.string.isRequired,
};

export default TaskViewMini;
