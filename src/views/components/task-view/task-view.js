import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { getAuth } from 'src/auth';
import {debounce} from 'lodash';
import Icon from '../icon';
import Textarea from 'react-textarea-autosize';
import { Textbox } from 'react-inputs-validation';
import TagsInput from 'react-tagsinput';
import { getCommentList } from 'src/comments';
import Select from 'react-select';
import CommentList from '../comment-list';
import TagsSuggestions from '../tags-suggestions';
import AddComment from '../add-comment/add-comment';
import TaskViewHeader from '../task-view-header/task-view-header';
import { I18n } from 'react-i18next';
import i18n from '../../../i18n.js';
import {notificationActions} from '../../../notification';
import { TakeOwnershipModal }  from '../take-ownership-modal';
import TaskCreator from "../task-creator/task-creator";
import _ from 'lodash';
import 'react-tagsinput/react-tagsinput.css';
import './task-view.css';

export class TaskView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      description: '',
      requirements: '',
      type: '',
      defaultType: [],
      label: [],
      listeners: [],
      isCritical: false,
      isDone: false,
      validations: {},
      shouldOpenTakeOwnerModal: false,
      extraFields: {},
      didDebounce: false, //TODO - not sure why it helps with debounced,
      shouldOpenAssignmentModal: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleExtraFieldChange = this.handleExtraFieldChange.bind(this);
    this.handleTextBoxChange = this.handleTextBoxChange.bind(this);
    this.handleLabelChange = this.handleLabelChange.bind(this);
    this.handleAddLabel = this.handleAddLabel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.selectedTaskType = this.selectedTaskType.bind(this);
    this.handleMarkAsDoneUndone = this.handleMarkAsDoneUndone.bind(this);
    this.isValid = this.isValid.bind(this);

    this.debouncedHandleSubmit = debounce(this.handleSubmit, 300);
  }

  static propTypes = {
    selectTask: PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired,
    removeTask: PropTypes.func.isRequired,
    assignTask: PropTypes.func.isRequired,
    followTask: PropTypes.func.isRequired,
    unfollowTask: PropTypes.func.isRequired,
    unassignTask: PropTypes.func.isRequired,
    selectedTask: PropTypes.object,
    selectedProject: PropTypes.object,
    isAdmin: PropTypes.bool.isRequired,
    isGuide: PropTypes.bool.isRequired,
    unloadComments: PropTypes.func.isRequired,
    isValidCallback: PropTypes.func.isRequired,
    isDraft: PropTypes.bool.isRequired,
    submitNewTask: PropTypes.func.isRequired
  };

  getTaskTypeFromProject(index) {
    if (!this.props.selectedProject ||
      !this.props.selectedProject.taskTypes ||
      this.props.selectedProject.taskTypes.length <= 0 ||
      this.props.selectedProject.taskTypes.length <= index
    ) {
      return '';
    } else {
      return this.props.selectedProject.taskTypes[index];
    }
  }

  getExtraFieldsKeysFromProject() {
    if (!this.props.selectedProject ||
      !this.props.selectedProject.extraFields ||
      this.props.selectedProject.extraFields.length <= 0
    ) {
      return null;
    } else {
      return this.props.selectedProject.extraFields;
    }
  }

  componentWillMount() {
    this.updateStateByProps(this.props);
  }

  updateStateByProps(props) {
    let nextSelectedTask = props.selectedTask || {};
    let { id, title, description, requirements, type,
      label, isCritical, listeners, dueDate, created, isDone, doneDate,
      extraFields
    } = nextSelectedTask;

      // this checks if we got another task, or we're updating the same one
      if (id !== this.state.id) {
        const labelAsArray = label ?
          (Object.keys(label).map( l => { return l })) : [];

        // Set default task types
        let defaultType = this.getDefaultTaskTypes(props);

        let popularTags = this.getPopularTags(props);

        this.setState({
          id: id || '',
          title: title || '',
          description:description || '',
          requirements:requirements || '',
          label: labelAsArray || [],
          listeners: listeners || [],
          isCritical: isCritical || false,
          isDone: isDone || false,
          created: created || null,
          doneDate: doneDate || null,
          dueDate: dueDate || null,
          type: type || null,
          defaultType: defaultType || [],
          popularTags: popularTags,
          extraFields: extraFields || {},
          validation: {}
        });
      } else {
        // A new task?

        // Set default task types
        let defaultType = this.getDefaultTaskTypes(props);

        let popularTags = this.getPopularTags(props);

        this.setState({
          defaultType: defaultType || [],
          popularTags: popularTags,
        });
      }
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

  getPopularTags(props) {
    if (props.selectedProject &&
      props.selectedProject.popularTags)
    {
      const popularTagsAsKeys = Object.keys(props.selectedProject.popularTags);
      if(popularTagsAsKeys.length >=0) {
        return popularTagsAsKeys;
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    // TODO - check this maybe called several times now that we use comments

    this.updateStateByProps(nextProps);
  }

  selectedTaskType(selected, fieldName) {
    let val = null;

    if (selected) { val = selected; }

    this.setState({ [fieldName]: val });
  }

  render() {
    const task = this.props.selectedTask;

    if (!task) {
      return (
        <div className="task-view g-row">
          <div className="g-col">
            <h1>&nbsp;</h1>
          </div>
        </div>
      );
    }

    const { auth, isAdmin, isDraft, selectedTask, selectTask, followTask, unfollowTask, unassignTask, removeTask } = this.props;
    const { description, defaultType, popularTags } = this.state;

    const isUserCreator = task.creator && task.creator.id === auth.id;
    const isUserAssignee = task.assignee && task.assignee.id === auth.id;
    const canEditTask = isUserCreator || isUserAssignee || isAdmin;
    const canDeleteTask = isUserCreator || isAdmin;
    const showUnassignButton = isUserAssignee || isUserCreator || isAdmin;
    const showMarkAsDoneButton = !isDraft && canEditTask;
    // Uncomment this to allow to unassign only for admins / guides
    //const showUnassignButton = this.props.isAdmin || (this.props.isGuide && isUserCreator)

    const showSaveButton = canEditTask;
    const isTaskEmpty = (!description || description === '');

    const oneDay = 60 * 60 * 24 * 1000;
    // We allow deletion of task which created in the last 24 hours
    let isTaskCreatedInTheLastDay = false;

    if (task && task.created) {
      const now = new Date();

      isTaskCreatedInTheLastDay = (now - task.created) <= oneDay;
    }

    const showDeleteButton = (!isDraft && (isTaskEmpty || isTaskCreatedInTheLastDay) && canDeleteTask) || (isAdmin && !isDraft);
    const showButtonAsFollow = _.includes(task.listeners, auth.id);

    return (
      <I18n ns="translations">
      {
      (t, { i18n }) => (
        <div className="task-view-container" dir={t('lang-dir')}>
          <TaskViewHeader
            task={selectedTask}
            canDeleteTask={canDeleteTask}
            selectTask={selectTask}
            assignTask={() => this.setState({ shouldOpenAssignmentModal: true })}
            followTask={followTask}
            unfollowTask={unfollowTask}
            unassignTask={unassignTask}
            removeTask={removeTask}
            showUnassignButton={showUnassignButton}
            showSaveButton={showSaveButton}
            showButtonAsFollow={showButtonAsFollow}
            showDeleteButton={showDeleteButton}
            showMarkAsDoneButton={showMarkAsDoneButton}
            isDraft={isDraft}
            saveTask={this.handleSave}
            markAsDoneUndone={this.handleMarkAsDoneUndone}
            auth={auth}/>
          <div className="task-view">
            <form noValidate>
              <div className="form-input">
                {canEditTask ?
                  this.renderInput('title', t('task.name'), t, canEditTask, '0', true, true) :
                  <span>{task.title}</span>}
              </div>
              <div className="form-input">
                {canEditTask ?
                  this.renderTextArea('description', t, canEditTask, '0', 'task.description') :
                  <span>{task.description}</span>}
              </div>
              <div className="form-input">
                {canEditTask ?
                  this.renderTextArea('requirements', t, canEditTask, '0', 'task.requirements') :
                  <span>{task.requirements}</span>}
              </div>
              <div className="form-input"><div className={`instruction instruction-${t('lang-float')}`}><span>{t('task.type')}</span></div>
                {canEditTask ?
                  this.renderSelect('type', t('general.select-default'), defaultType, t,'0') :
                  <span className={`task-type task-type-${t('lang-float')}`}>{(task.type) ? task.type.label : ''}<br/></span>}
              </div>

              <div className={`tags-container tags-container-${t('lang-float')}`}>
                <Icon className="label notranslate" name="loyalty"/> {this.renderTags(canEditTask, t, '0')}
              </div>

              {(canEditTask && popularTags) &&
                <div>
                  <div className="instruction-label">
                    <span>{t('task.automatic-tags')}</span>
                  </div>
                  <div>
                    <TagsSuggestions
                      tags={popularTags}
                      onTagSelected={(tag) => {
                        this.handleAddLabel(tag);
                      }}/>
                  </div>
                </div>}

              {canEditTask && this.state.extraFields && this.renderExtraFields(t,task, canEditTask)}

              {canEditTask &&
                <div className="is-critical">
                  {this.renderCheckbox(task, 'isCritical', t('task.is-critical'), canEditTask)}
                </div>}
              <TaskCreator creator={task.creator}/>
            </form>
          </div>

          <CommentList
            task={task}
            comments={this.props.comments}
            auth={this.props.auth}
            updateComment={this.props.updateComment}
            removeComment={this.props.removeComment}
          />

          { this.renderAddComment() }
          { this.renderTakeOwnershipModal(task) }
          { this.renderAssignmentModal(task) }
        </div>
      )}
      </I18n>
    );
  }

  renderExtraFields(t, task, canEditTask) {
    const extraFields = this.getExtraFieldsKeysFromProject();

    if (!extraFields) { return; }

    const extraFieldItems = extraFields.map((extraField, index) => {
      return (
        <div className="form-input" key={index}>
          {canEditTask ?
            this.renderInput('extra-field-' + extraField, extraField, t, canEditTask, '0', true, false, true) :
            <span>{ extraField }</span>
          }
        </div>
      );
    });

    return (
      <div>
        {extraFieldItems}
      </div>
    );
  }

  renderAddComment() {
    const { selectedTask, createComment, auth } = this.props;

    return (
      <AddComment
        task={selectedTask }
        createComment={createComment }
        auth={auth}
        key="addComment"/>
    );
  }

  renderSelect(fieldName, placeholder, options, translation, tabIndex) {
    return (
      <Select
        type="text"
        name={fieldName}
        value={this.state[fieldName]}
        tabIndex={tabIndex}
        onChange={(e) => { this.selectedTaskType(e, fieldName)}}
        options={options}
        isSearchable={false}
        placeholder={placeholder }
        noResultsText={translation('general.no-results-found')}
        searchable={false}/>
    );
  }

  renderInput(fieldName, placeholder, t, isEditable, tabIndex, isAutoFocus, isRequired = false, isExtra = false) {
    const classNames = isEditable ? ' editable' : '';
    const value = isExtra ? this.state.extraFields[fieldName] : this.state[fieldName];
    const onChangeHandler = isExtra ? this.handleExtraFieldChange : this.handleChange;

    return(
      <Textbox
        classNameInput={`changing-input${classNames}`}
        type="text"
        tabIndex={tabIndex}
        name={fieldName}
        value={value}
        placeholder={placeholder}
        ref={(e) => this[fieldName+'Input'] = e}
        onChange={onChangeHandler}
        onBlur={this.handleSubmit} // here to trigger validation callback on Blur
        onKeyUp={() => {}} // here to trigger validation callback on Key up
        disabled={!isEditable}
        autofocus={isAutoFocus}
        validationOption={{ required: isRequired, msgOnError: t('task.errors.not-empty') }}
        validationCallback={(res) => this.setState({ validations: {...this.state.validations, title: res }})}/>
    );
  }

  renderTextArea(fieldName, t, isEditable, tabIndex, placeHolder) {
    const classNames = isEditable ? ' editable' : '';
    return (
        <Textarea
        className={`changing-input${classNames}`}
        name={fieldName}
        tabIndex={tabIndex}
        value={this.state[fieldName]}
        placeholder={t(placeHolder)}
        ref={e => this[fieldName+'Input'] = e}
        onChange={this.handleTextBoxChange}
        onBlur = { this.handleSubmit } // here to trigger validation callback on Blur
        onKeyUp={ () => {}} // here to trigger validation callback on Key up
        disabled = { !isEditable }
        //validationOption={{ required: true, msgOnError: t('task.errors.not-empty') }}
        //validationCallback = {res=>this.setState({validations: {...this.state.validations, description: res}})}
        />
    );
  }

  renderTags(isEditable, translation, tabIndex) {
    const showPlaceholder = this.state.label.length === 0;
    const classNames = isEditable ? ' editable' : '';

    return (
      <TagsInput className={`react-tagsinput-changing ${classNames}`}
      tabIndex={tabIndex}
      value={this.state.label}
      onChange={this.handleLabelChange}
      onlyUnique={true}
      addOnBlur={true}
      inputProps={{ placeholder: showPlaceholder ? translation('task.input-tags') : ''}}
      onRemove= { this.handleLabelChange }
      disabled = { !isEditable }
      MaxTags = {6}
      validationOption={{ required: true, msgOnError: translation('task.errors.not-empty') }}
      validationCallback = {res=>this.setState({validations: {...this.state.validations, description: res}})}
      />
    )
  }

  renderCheckbox(task, fieldName, placeholder, isEditable) {
    const classNames = isEditable ? ' editable' : '';
    return (
      <label>
        <input
          className={ classNames }
        type = 'checkbox'
        checked = { this.state[fieldName] }
        value = { placeholder }
        onChange={e => { this.setState({ [fieldName]: !this.state[fieldName]}) }}
        disabled = { !isEditable }
        />
        { placeholder }
      </label>
    );
  }

  // We are checking that task.id exist to prevent a race condition
  renderTakeOwnershipModal(task) {
    return (
      <div>
        <TakeOwnershipModal
          isOpen = { task && task.id && this.state.shouldOpenTakeOwnerModal }
          onClosed = { () => {
            this.setState({shouldOpenTakeOwnerModal: false});
          }}
          onYes ={() => {
            this.setState({shouldOpenTakeOwnerModal: false});
            this.props.assignTask(task);
          }
          }
          header={'task.do-you-take-ownership'}
          textLines={['task.do-you-take-ownership2']}
        />
      </div>
    );
  }

  renderAssignmentModal(task) {
    let header, textLines;
    if (this.state.requirements == null || this.state.requirements === "") {
      header = 'task.do-you-take-ownership'
    }else {
      header = 'task.pay-attention-to-the-requirements';
      textLines = [this.state.requirements, 'task.do-you-take-ownership'];
    }

    return (
      <div>
        <TakeOwnershipModal
          isOpen={task && task.id && this.state.shouldOpenAssignmentModal}
          onClosed={() => {
            this.setState({shouldOpenAssignmentModal: false});
          }}
          onYes={() => {
            this.setState({shouldOpenAssignmentModal: false});
            this.props.assignTask(task);
          }
          }
          header={header}
          textLines={textLines}
        />
      </div>
    );
  }

  handleChange(n, e) {
    let fieldName = e.target.name;
    this.setState({
      [fieldName]: e.target.value
    });
  }

  // We use one object - extraFields to store all the extra fields data
  // So it can be: {'name':'extra name', 'another_field': 'extra_field_value'}
  handleExtraFieldChange(n, e) {
    let fieldName = e.target.name;
    const newObject = { [fieldName]: e.target.value };
    this.setState({
      'extraFields': Object.assign(this.state.extraFields, newObject)
    });
  }

  handleTextBoxChange(o) {
    let fieldName = o.target.name;
    this.setState({
      [fieldName]: o.target.value
    });
  }

  handleAddLabel(label) {
    let newLabels = this.state.label;
    newLabels.push(label);
    this.handleLabelChange(newLabels)
  }

  handleLabelChange(label) {
    // Clear leading and trailing white space
    for(let i=0;i<label.length;i++) {
      label[i] = label[i].trim();
    }
    this.setState({label})
  }

  isValid() {
    let res = false;
    Object.values(this.state.validations).forEach( x => res = x || res);
    // also check actual values...
    res = res || this.state.label.length === 0; // check also there's at least one label
    res = res || this.state.title.length === 0;
    res = res || this.state.description.length === 0;
    res = res || (this.state.type && this.state.type.length === 0);

    this.props.isValidCallback(!res); // this says to parent if task is valid (mainly for showing warning thingy)
    return !res;
  }

  componentDidUpdate(prevProps, prevState) {
    if(!prevState.didDebounce) {
      this.debouncedHandleSubmit(); //This causes a refresh bug of many many many sends - not sure why its here
      this.setState({didDebounce: true});
    }
  }

  getFormFields() {
    let labelAsObject = TaskView.arrayToObject(this.state.label);
    const fieldsToUpdate = {
      title: this.state.title,
      description: this.state.description,
      requirements: this.state.requirements,
      label: labelAsObject,
      isCritical: this.state.isCritical,
      isDone: this.state.isDone,
      type: this.state.type,
      extraFields: this.state.extraFields
    };


    fieldsToUpdate.dueDate = this.state.dueDate || null;

    return fieldsToUpdate;
  }

  handleSave() {
    if (this.isValid()) {
      // Is task a draft and first time being saved
      if(this.props.isDraft) {
        this.props.submitNewTask(this.getFormFields());
        this.setState({shouldOpenTakeOwnerModal: true});
      }else {
        // Not a draft but a normal save
        this.handleSubmit();
        this.props.showSuccess(i18n.t('task.updated-successfully'));
      }
    }else {
      this.props.showError(i18n.t('task.mission-incomplete-short'));
    }
  }

  handleMarkAsDoneUndone() {
    this.setState({isDone: !this.state.isDone});
    this.props.updateTask(this.props.selectedTask, {isDone: !this.state.isDone});
    this.props.showSuccess(i18n.t('task.updated-successfully'));
  }

  handleSubmit(event) {
    if(event) {
      event.preventDefault();
    }

    if (this.props.isDraft || !this.isValid()) {
      return;
    }

    this.props.updateTask(this.props.selectedTask, this.getFormFields());
  }

  static arrayToObject(array) {
    let result = {};
    for (let i = 0; i < array.length; ++i)
      result[array[i]] = true;
    return result;
  }
}

//=====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = createSelector(
  getCommentList,
  getAuth,
  (comments, auth) => ({
    comments,
    auth
  })
);

const mapDispatchToProps = Object.assign(
  {},
  notificationActions,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskView);
