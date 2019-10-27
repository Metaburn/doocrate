import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-tagsinput/react-tagsinput.css';

import './taskViewMini.css';
import TaskCreator from "../../components/task-creator/task-creator";
import classNames from "classnames";
import Icon from "../../components/icon/icon";
import LabelsList from "../labelsList/labelsList";

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

    const {title, description, label, requirements, type, creator} = task;
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
        <div>
          <span className={'title'}>{title}</span>
        </div>
        <div>
          <span>{description}</span>
        </div>
        <div>
          <span>{requirements}</span>
        </div>
        <div>
          <div className={`instruction instruction-${i18n.t('lang-float')}`}><span>{i18n.t('task.type')}</span></div>
          <span className={`task-type task-type-${i18n.t('lang-float')}`}>{(type) ? type.label : ''}<br/></span>
        </div>

        <div className={`tags-container tags-container-${i18n.t('lang-float')}`}>
          <Icon className="label notranslate" name="loyalty"/> {this.renderLabels(labelAsArray, false, '0')}
        </div>

        <TaskCreator creator={creator}/>

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

}

TaskViewMini.propTypes = {
  onSelectTask: PropTypes.func.isRequired,
  onLabelClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  task: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
};

export default TaskViewMini
