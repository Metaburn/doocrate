import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { getAuth } from 'src/auth';
import {includes} from "lodash/collection";
import Icon from '../../atoms/icon';
import { Textbox } from 'react-inputs-validation';
import TagsInput from 'react-tagsinput';
import { getCommentList } from 'src/comments';
import Select from 'react-select';
import CommentList from '../comment-list';
import TagsSuggestions from '../tags-suggestions';
import AddComment from '../add-comment/add-comment';
import TaskViewHeader from '../task-view-header/task-view-header';
import i18n from '../../../i18n';
import {notificationActions} from '../../../notification';
import { TakeOwnershipModal }  from '../take-ownership-modal';
import TaskCreator from "../task-creator/task-creator";
import Button from "../button/button";
import TextAreaAutoresizeValidation from "../../molecules/TextAreaAutoresizeValidation/textAreaAutoresizeValidation";

import 'react-tagsinput/react-tagsinput.css';
import './task-view.css';

export class TaskView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
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
      validate: false,
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

  }

  // TODO: Move to utils or use Lodash instead
  static arrayToObject(array) {
    let result = {};

    for (let i = 0; i < array.length; ++i) {
      result[array[i]] = true;
    }

    return result;
  }

  componentWillReceiveProps(nextProps) {
    this.updateStateByProps(nextProps);
  }

  componentWillMount() {
    this.updateStateByProps(this.props);
  }

  // We only want this shouldComponentUpdatecomponent to be shown if this is an existing task
  // or if it's a new draft - that prevents a case where this component flashes
  // when a user deselects a task
  shouldComponentUpdate(nextProps) {
    return nextProps.selectedTask || nextProps.isDraft;
  }

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

  updateStateByProps(nextProps) {
    // If same id - don't update
    // This helps to also fight general updates from the app where this view should not care about
    // Otherwise on every update of the app - the fields are getting cleared
    if(nextProps.selectedTask && this.props.selectedTask && nextProps.selectedTask.id === this.props.selectedTask.id) {
      return;
    }

    let nextSelectedTask = nextProps.selectedTask || {};
    let { id, title, description, requirements, type,
      label, isCritical, listeners, dueDate, created, isDone, doneDate,
      extraFields,} = nextSelectedTask;

    const { isDraft } = nextProps;

    // this checks if we got another task, or we're updating the same one
      const labelAsArray = label ?
      (Object.keys(label).map( l => { return l })) : [];

      // Set default task types
      let defaultType = this.getDefaultTaskTypes(nextProps);
      let popularTags = this.getPopularTags(nextProps);

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
        validations: {},
      });

      // If user opens with a new existing task (that is not a draft, aka new task) - clear editing
      if ((nextSelectedTask && nextSelectedTask.id !== null) &&
        (nextSelectedTask.id !== this.state.id)) {
        this.setState({isEditing: false});
      }else {
        if (nextSelectedTask && nextSelectedTask.id === null) {
          this.setState({isEditing: isDraft || false});
        }
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

  selectedTaskType(selected, fieldName) {
    let val = null;

    if (selected) { val = selected; }

    this.setState({ [fieldName]: val });
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

  renderSelect(fieldName, placeholder, options, tabIndex) {
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
        noResultsText={i18n.t('general.no-results-found')}
        searchable={false}/>
    );
  }

  renderInput(fieldName, placeholder, isEditable, tabIndex, isAutoFocus, isRequired = false, isExtra = false) {
    const classNames = isEditable ? ' editable' : '';
    const value = isExtra ? this.state.extraFields[fieldName] : this.state[fieldName];
    const onChangeHandler = isExtra ? this.handleExtraFieldChange : this.handleChange;
    const { validate } = this.state;

    return(
      <Textbox
        classNameInput={`changing-input${classNames}`}
        type="text"
        tabIndex={tabIndex}
        name={fieldName}
        value={value}
        validate={validate}
        placeholder={placeholder}
        ref={(e) => this[fieldName+'Input'] = e}
        onChange={onChangeHandler}
        // React validation requires even an empty function onBlur to validate on blur
        onBlur={this.handleSubmit} // here to trigger validation callback on Blur.
        onKeyUp={() => {}} // here to trigger validation callback on Key up
        disabled={!isEditable}
        autofocus={isAutoFocus}
        validationOption={{name: fieldName, check: true, required: isRequired, msgOnError: i18n.t('task.errors.not-empty') }}
        validationCallback={(res) => this.setState({ validations: {...this.state.validations, [fieldName]: res }})}/>
    );
  }

  renderTextArea(fieldName, isEditable, placeHolder, isRequired) {
    const { validate } = this.state;

    return(<TextAreaAutoresizeValidation
      validate={validate}
      validations={{...this.state.validations}}
      fieldName={fieldName}
      isEditable={isEditable}
      placeHolder={placeHolder}
      isRequired={isRequired}
      value={this.state[fieldName]}
      onTextBoxChange={this.handleTextBoxChange}
      onValidationChange={(fieldName, res) => {this.setState({validations: {...this.state.validations, [fieldName]: res }})}}
    />);
  }


  renderTags(isEditable, tabIndex) {
    const { label, validate} = this.state;
    const isShowPlaceholder = label.length === 0;
    const classNames = isEditable ? ' editable' : '';
    const fieldName = 'label';
    const msgOnError = i18n.t('task.errors.not-empty');

    // Since we are using a custom control we need to perform our own validation method
    const validateTags = () => {
      const isValid = (label && label.length > 0);
      this.setState({validations: {...this.state.validations, [fieldName]: isValid }})
    };

    return (
      <Fragment>
        <TagsInput
          className={`react-tagsinput-changing ${classNames}`}
          tabIndex={tabIndex}
          value={label}
          onChange={this.handleLabelChange}
          onlyUnique={true}
          addOnBlur={true}
          onBlur={e => {}} //react validation requires a function on blur even empty to validate
          inputProps={{ placeholder: isShowPlaceholder ? i18n.t('task.input-tags') : ''}}
          onRemove={this.handleLabelChange}
          disabled={!isEditable}
          MaxTags={6}
          validationOption={{ required: true, msgOnError: msgOnError }}
          validationCallback={(res) => this.setState({validations: {...this.state.validations, tags: res }})}/>

        <Textbox
          classNameInput={`hidden`}
          type="text"
          name={'tags'}
          value={label? label.toString() : ''}
          validate={validate}
          onChange={() => {}}
          onBlur={(e) => {}} // here to trigger validation callback on Key up
          validationOption={{check: true, required: true, msgOnError: msgOnError }}
          validationCallback={(res) => validateTags()} />


      </Fragment>
    );
  }

  renderCheckbox(task, fieldName, placeholder, isEditable) {
    const classNames = isEditable ? ' editable' : '';

    return (
      <label>
        <input
          className={ classNames }
          type="checkbox"
          checked={this.state[fieldName]}
          value={ placeholder }
          onChange={() => { this.setState({ [fieldName]: !this.state[fieldName]}) }}
          disabled={!isEditable}/>
        {placeholder}
      </label>
    );
  }

  // We are checking that task.id exist to prevent a race condition
  renderTakeOwnershipModal(task) {
    const { assignTask } = this.props;
    const { shouldOpenTakeOwnerModal } = this.state;

    return (
      <div>
        <TakeOwnershipModal
          isOpen={task && task.id && shouldOpenTakeOwnerModal}
          onClosed={() => {
            this.setState({ shouldOpenTakeOwnerModal: false });
          }}
          onYes={() => {
            this.setState({ shouldOpenTakeOwnerModal: false });
            assignTask(task);
          }}
          header={'task.do-you-take-ownership'}
          textLines={['task.do-you-take-ownership2']}/>
      </div>
    );
  }

  renderAssignmentModal(task) {
    const { assignTask } = this.props;
    const { requirements, shouldOpenAssignmentModal } = this.state;
    let header, textLines;

    if (requirements == null || requirements === "") {
      header = 'task.do-you-take-ownership';
    } else {
      header = 'task.pay-attention-to-the-requirements';
      textLines = [requirements, 'task.do-you-take-ownership'];
    }

    return (
      <div>
        <TakeOwnershipModal
          isOpen={task && task.id && shouldOpenAssignmentModal}
          onClosed={() => {
            this.setState({shouldOpenAssignmentModal: false});
          }}
          onYes={() => {
            this.setState({shouldOpenAssignmentModal: false});
            assignTask(task);
          }}
          header={header}
          textLines={textLines}/>
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
    for (let i=0;i<label.length;i++) {
      label[i] = label[i].trim();
    }

    this.setState({ label });
  }

  isValid() {
    this.toggleValidating(true); // This sets all the text messages below invalid fields
    let res = false;

    res = res || this.state.title.length === 0;
    res = res || this.state.description.length === 0;

    res = res || (this.state.type && this.state.type.length === 0);

    // TODO - somehow the following line causes draft tasks to get reset while not valid

    //this.props.isValidCallback(!res); // this says to parent if task is valid (mainly for showing warning thingy)

    return !res;
  }

  getFormFields() {
    const { title, description, requirements, isCritical, isDone, type, extraFields, dueDate } = this.state;
    let labelAsObject = TaskView.arrayToObject(this.state.label);

    const fieldsToUpdate = {
      title,
      description,
      requirements,
      label: labelAsObject,
      isCritical,
      isDone,
      type,
      extraFields
    };

    fieldsToUpdate.dueDate = dueDate || null;

    return fieldsToUpdate;
  }

  handleSave() {
    const { isDraft, submitNewTask, showSuccess } = this.props;

    if (this.isValid()) {
      // Is task a draft and first time being saved
      if (isDraft) {
        submitNewTask(this.getFormFields());
        this.setState({ shouldOpenTakeOwnerModal: true });
      } else {
        // Not a draft but a normal save
        this.handleSubmit();
        showSuccess(i18n.t('task.updated-successfully'));
      }
    }
  }

  handleMarkAsDoneUndone() {
    const { updateTask, selectedTask, showSuccess } = this.props;
    const { isDone } = this.state;

    this.setState({ isDone: !isDone });
    updateTask(selectedTask, { isDone: !isDone });
    showSuccess(i18n.t('task.updated-successfully'));
  }

  handleSubmit(event) {
    if (event) { event.preventDefault(); }

    const { isDraft, updateTask, selectedTask } = this.props;

    // TODO - check if correct
    // Task was already saved (Due to onBlur) and state got cleared - no need to save
    if(!this.state.id) {
      return;
    }

    // On draft - we would call handleSubmit before the task has all fields complete
    // This prevents it
    if (isDraft || !this.isValid()) {
      return;
    }

    updateTask(selectedTask, this.getFormFields());
  }

  isUserCreator = () => {
    const { auth, selectedTask } = this.props;
    return selectedTask && selectedTask.creator && selectedTask.creator.id === auth.id;
  };

  doesTaskHasAssignee = () => {
    const { selectedTask } = this.props;
    return selectedTask && selectedTask.assignee;
  };

  isUserAssignee = () => {
    const { auth, selectedTask } = this.props;
    return this.doesTaskHasAssignee() && selectedTask.assignee.id === auth.id;
  };

  onEditTask = () => {
    this.setState({isEditing: !this.state.isEditing});
  };

  getTaskViewHeaderProps = () => {
    const { selectedTask, isAdmin ,isDraft, selectTask, followTask,
      unfollowTask,  unassignTask, onDeleteTask, selectedProject, auth, userPermissions } = this.props;
    const { isEditing, description } = this.state;

    const projectUrl = (selectedProject && selectedProject.url) ? selectedProject.url:
      auth.defaultProject;

    const isUserCreator = this.isUserCreator();
    const isUserAssignee = this.isUserAssignee();
    const doesTaskHasAssignee = this.doesTaskHasAssignee();
    const canEditTask = isUserCreator || isUserAssignee || isAdmin;
    const canDeleteTask = isEditing && (isUserCreator || isAdmin);
    const isShowUnassignButton = (isUserAssignee || (isEditing && (isUserCreator || isAdmin) && doesTaskHasAssignee));

    const isShowMarkAsDoneButton = (!isDraft && canEditTask);
    // Uncomment this to allow to unassign only for admins / guides
    //const showUnassignButton = this.props.isAdmin || (this.props.isGuide && isUserCreator)

    const isShowSaveButton = isEditing && canEditTask;
    const isTaskEmpty = (!description || description === '');

    const oneDay = 60 * 60 * 24 * 1000;
    // We allow deletion of task which created in the last 24 hours
    let isTaskCreatedInTheLastDay = false;

    if (selectedTask && selectedTask.created) {
      const now = new Date();
      isTaskCreatedInTheLastDay = (now - selectedTask.created) <= oneDay;
    }

    const isShowDeleteButton = ((!isDraft && (isTaskEmpty || isTaskCreatedInTheLastDay) && canDeleteTask) || (isAdmin && !isDraft));
    const showButtonAsFollow = selectedTask && !includes(selectedTask.listeners, auth.id);

    return {
      task: selectedTask,
      canDeleteTask: canDeleteTask,
      selectTask: selectTask,
      assignTask: () => this.setState({ shouldOpenAssignmentModal: true }),
      followTask: followTask,
      unfollowTask: unfollowTask,
      onUnassignTask: unassignTask,
      onDeleteTask: onDeleteTask,
      onEditTask: this.onEditTask,
      isShowUnassignButton: isShowUnassignButton,
      isShowSaveButton: isShowSaveButton,
      showButtonAsFollow: showButtonAsFollow,
      isShowDeleteButton: isShowDeleteButton,
      isShowMarkAsDoneButton: isShowMarkAsDoneButton,
      isShowEditButton: canEditTask,
      isDraft: isDraft,
      saveTask: this.handleSave,
      markAsDoneUndone: this.handleMarkAsDoneUndone,
      auth: auth,
      projectUrl: projectUrl,
      closeTaskView: this.props.closeTaskView,
      userPermissions: userPermissions
    }
  };

  toggleValidating = (validate) => {
    this.setState({ validate });
  };

  render() {
    const { selectedTask } = this.props;
    if (!selectedTask) return null;

    const { isDraft, selectedProject, auth, isAdmin, userPermissions } = this.props;
    const { defaultType, popularTags, isEditing } = this.state;
    const projectUrl = (selectedProject && selectedProject.url) ? selectedProject.url:
      auth.defaultProject;

    const canEditTask = (this.isUserCreator() || this.isUserAssignee() || isAdmin)
      && userPermissions.canAdd === true;
    const showSaveButton = isEditing && canEditTask;

    return (
      <div className="task-view-container" dir={i18n.t('lang-dir')}>
        <TaskViewHeader {...this.getTaskViewHeaderProps()}/>
        <div className="task-view">
          <form>
            <div className="form-input">
              {canEditTask && isEditing ?
                this.renderInput('title', i18n.t('task.name'), canEditTask, '0', true, true) :
                <span>{selectedTask.title}</span>}
            </div>
            <div className="form-input">
              {canEditTask && isEditing ?
                this.renderTextArea('description', canEditTask, i18n.t('task.description'), true) :
                <span>{selectedTask.description}</span>}
            </div>
            <div className="form-input">
              {canEditTask && isEditing ?
                this.renderTextArea('requirements', canEditTask, i18n.t('task.requirements')) :
                <span>{selectedTask.requirements}</span>}
            </div>
            <div className="form-input"><div className={`instruction instruction-${i18n.t('lang-float')}`}><span>{i18n.t('task.type')}</span></div>
              {canEditTask && isEditing ?
                this.renderSelect('type', i18n.t('general.select-default'), defaultType,'0') :
                <span className={`task-type task-type-${i18n.t('lang-float')}`}>{(selectedTask.type) ? selectedTask.type.label : ''}<br/></span>}

            </div>

            <div className={`tags-container tags-container-${i18n.t('lang-float')}`}>
              <Icon className="label notranslate" name="loyalty"/> {this.renderTags(isEditing && canEditTask, '0')}
            </div>

            {(canEditTask && isEditing && popularTags) &&
              <div>
                <div className="instruction-label">
                  <span>{i18n.t('task.automatic-tags')}</span>
                </div>
                <div>
                  <TagsSuggestions
                    tags={popularTags}
                    onTagSelected={(tag) => {
                      this.handleAddLabel(tag);
                    }}/>
                </div>
              </div>}

            {canEditTask && isEditing && this.state.extraFields && this.renderExtraFields(i18n.t, selectedTask, canEditTask)}

            {canEditTask && isEditing &&
              <div className="is-critical">
                {this.renderCheckbox(selectedTask, 'isCritical', i18n.t('task.is-critical'), canEditTask)}
              </div>}
            {!isDraft &&
              <TaskCreator creator={selectedTask ? selectedTask.creator : null} projectUrl={projectUrl}/>
            }
          </form>
        </div>

        { !isDraft && <CommentList
          task={selectedTask}
          comments={this.props.comments}
          auth={this.props.auth}
          updateComment={this.props.updateComment}
          removeComment={this.props.removeComment}
          projectUrl={projectUrl}/> }

        { !isDraft && userPermissions.canComment === true && this.renderAddComment() }

        { isDraft && showSaveButton &&
        <div className={'button-save-wrapper'}>
          <Button
          className={"save-button"}
          onClick={this.handleSave}
          type='button'>{i18n.t('task.save')}</Button>
        </div>
        }

        { this.renderTakeOwnershipModal(selectedTask) }
        { this.renderAssignmentModal(selectedTask)}
      </div>
    );
  }
}

TaskView.propTypes = {
  updateTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
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
  submitNewTask: PropTypes.func.isRequired,
  closeTaskView: PropTypes.func.isRequired,
  userPermissions: PropTypes.object.isRequired
};

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
