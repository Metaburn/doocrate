import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Textbox } from 'react-inputs-validation';
import { I18n } from 'react-i18next';
import { projectActions } from 'src/projects';
import {notificationActions} from '../../../notification';
import i18n from '../../../i18n.js';
import './create-project.css';

class CreateProject  extends Component {

  constructor() {
    super(...arguments);

    this.state = {
      name: '',
      projectUrl: '',
      validations: {},
      type0: '',
      type1: '',
      type2: '',
      type3: '',
      type4: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isValid = this.isValid.bind(this);
  }

  render() {
    return (
      <I18n ns='translations'>
        {
          (t, {i18n}) => (
            <div className='g-row create-project'>
              <br/>
              <h1>{t('create-project.header')}</h1>
              <h3>{t('create-project.subtitle')}</h3>
              <form noValidate onSubmit={this.handleSubmit}>
                <div className='form-input'>
                  <span>{t('create-project.name-placeholder')}</span>
                  { this.renderInput('name', t('create-project.name-placeholder'), t, true, '0', true)}
                </div>
                <div className='form-input'>
                  <span>{t('create-project.project-url-placeholder')}</span>
                  { this.renderInput('projectUrl', t('create-project.project-url-placeholder'), t, true, '0', true)}
                  {
                    this.state.projectUrl ?
                      <span>{`doocrate.com/${this.state.projectUrl}`}</span> :
                      <span>{t('create-project.project-url-explain')}</span>
                  }
                </div>
                <div className='form-input'>
                  <span>{t('create-project.task-types')}</span>
                  <br/>
                  <span>{t('create-project.task-types-explain')}</span>
                  { this.renderInput('type0', t('task.types.planning'), t, true, '0', true)}
                  { this.renderInput('type1', t('task.types.shifts'), t, true, '0', true)}
                  { this.renderInput('type2', t('task.types.camps'), t, true, '0', true)}
                  { this.renderInput('type3', t('task.types.art'), t, true, '0', true)}
                  { this.renderInput('type4', t('task.types.other'), t, true, '0', true)}
                </div>
                <br/>
                { this.renderSubmit(t) }
              </form>
              <br/>
            </div>
          )}
      </I18n>
    )
  }

  renderInput(fieldName, placeholder, t, isEditable, tabIndex, isAutoFocus) {
    const classNames = isEditable ? ' editable' : '';
    return( <Textbox
      className={`changing-input${classNames}`}
      type = 'text'
      tabIndex = { tabIndex }
      name = { fieldName }
      value = { this.state[fieldName] }
      placeholder = { placeholder }
      ref = { e => this[fieldName+'Input'] = e }
      onChange = { this.handleChange }
      onKeyUp={ () => {}} // here to trigger validation callback on Key up
      disabled = { !isEditable }
      autofocus = { isAutoFocus }

      validationOption={{ required: true, msgOnError: t('task.errors.not-empty') }}
      validationCallback = {res=>this.setState({validations: {...this.state.validations, [fieldName]: res}})}
    />)
  }

  renderSubmit(t) {
    return (
      <input className={`button button-small` }
             type='submit' value={t('create-project.submit-btn')}/>);
  }

  handleChange(n, e) {
    let fieldName = e.target.name;
    this.setState({
      [fieldName]: e.target.value
    });
  }

  handleSubmit(event) {
    if(event) {
      event.preventDefault();
    }

    if (!this.isValid()) {
      this.props.showError(i18n.t('create-project.err-incomplete'));
      return;
    }

    this.props.createProject(this.state.projectUrl, this.getFormFields());
    this.props.showSuccess(i18n.t('create-project.success'));
    this.props.history.push('/' + this.state.projectUrl + '/task/1');
  }

  isValid() {
    const englishRegex = /^[A-Za-z0-9_-]*$/;
    let res = false;
    Object.values(this.state.validations).forEach( x => res = x || res);
    res = res || this.state.name.length === 0;
    res = res || this.state.projectUrl.length === 0;
    res = res || this.state.projectUrl.match(englishRegex) === null;
    res = res || this.state.type0.length === 0;
    res = res || this.state.type1.length === 0;
    res = res || this.state.type2.length === 0;
    res = res || this.state.type3.length === 0;
    res = res || this.state.type4.length === 0;
    // TODO add more validations here

    return !res;
  }

  getFormFields() {
    const creator = {
      id: this.props.auth.id,
      name: this.props.auth.name,
      email: this.props.auth.updatedEmail || this.props.auth.email,
      photoURL: this.props.auth.photoURL,
    };

    const taskTypes = [
      this.state.type0,
      this.state.type1,
      this.state.type2,
      this.state.type3,
      this.state.type4];

    console.log(taskTypes);

    return {
      name: this.state.name,
      creator: creator,
      taskTypes: taskTypes
    };
  }
}

CreateProject.propTypes = {
  createProject: PropTypes.func.isRequired,
};


//=====================================
//  CONNECT
//-------------------------------------
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  }
};

const mapDispatchToProps = Object.assign(
  {},
  notificationActions,
  projectActions,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateProject);
