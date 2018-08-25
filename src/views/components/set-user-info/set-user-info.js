import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './set-user-info.css';
import Img from 'react-image';
import { I18n } from 'react-i18next';
import Modal from 'react-responsive-modal';

export class SetUserInfo extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      isOpen: true,
      email: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onOpenModal = () => {
    this.setState({ isOpen: true });
  };

  onCloseModal = () => {
    this.setState({ isOpen: false });
    this.props.onClosed();
  };

  componentWillMount() {
    this.updateStateByProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateStateByProps(nextProps);
  }

  updateStateByProps(props) {
    if (!props) {
      return;
    }

    this.setState({
      // First try to see if there is an updated mail.
      // Otherwise revert to original mail
      email: props.userInfo.updatedEmail || props.userInfo.email || '',
      isOpen: props.isOpen || false,
    })
  }

  render() {
    const { userInfo, isOpen:isOpenProps } = this.props;
    const { isOpen:isOpenState } = this.state;

    const isOpen = isOpenProps && isOpenState;

    return (
      <I18n ns='translations'>
        {
          (t, { i18n }) => (
            <Modal open={isOpen} onClose={this.onCloseModal} center>
              <div className='set-user-info'>
                <div className='modal-content'>
                  {this.renderHeader(t, userInfo)}
                  {this.renderBody(t, userInfo)}
                </div>
              </div>
            </Modal>
          )
        }
      </I18n>
    );
  }

  renderHeader(t, userInfo) {
    const { name, photoURL } = userInfo;
    const avatar = photoURL ? <Img className='avatar' src={photoURL} alt={name}/> : '';
    return (
      <div className='modal-header'>
        <span>{ avatar } { name }</span>
      </div>
    );
  }

  renderBody(t, userInfo) {
    return (
      <div className='modal-body'>
        <form onSubmit={this.handleSubmit}>
          <span>{t('user.email')}</span>
          {this.renderInput('email', t('user.set-my-email'), true, 'email')}
          {this.renderSubmit(t)}
        </form>
      </div>
    );
  }

  renderSubmit(t) {
    return (
      <div className={'submit-wrapper'}>
        <input className={`button button-small` }
               type="submit" value={t('user.submit')}/>
      </div>
    );
  }

  renderInput(fieldName, placeholder, isEditable, fieldType) {
    const classNames = isEditable ? ' editable' : '';
    return (
      <input
        className={`changing-input user-info-input ${classNames}`}
        type = { fieldType }
        name = { fieldName }
        value = { this.state[fieldName] }
        placeholder = { placeholder }
        ref = { e => this[fieldName+'Input'] = e }
        onChange = { this.handleChange }
        disabled = { !isEditable }
        required />
    );
  }

  handleChange(e) {
    let fieldName = e.target.name;
    this.setState({
      [fieldName]: e.target.value
    });
  }

  handleSubmit(event) {
    if(event) {
      event.preventDefault();
    }
    const fieldsToUpdate = {
      email: this.state.email,
    };

    if(this.state.email)

    this.props.updateUserInfo(fieldsToUpdate);
    this.onCloseModal();
  }

}

SetUserInfo.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  userInfo: PropTypes.object.isRequired,
  updateUserInfo: PropTypes.func.isRequired,
  onClosed: PropTypes.func.isRequired
};


export default SetUserInfo;
