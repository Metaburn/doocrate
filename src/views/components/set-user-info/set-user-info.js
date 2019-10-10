import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './set-user-info.css';
import Img from 'react-image';
import { I18n } from 'react-i18next';
import Modal from 'react-responsive-modal';

export class SetUserInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen,
      email: '',
      originalEmail: '',
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
    if (!props) { return; }

    const { originalEmail } = this.state;
    const { userInfo } = this.props;

    if(originalEmail !== userInfo.updatedEmail &&
        originalEmail !== userInfo.email) {

      this.setState({
        originalEmail: userInfo.updatedEmail || userInfo.email,
        // First try to see if there is an updated mail.
        // Otherwise revert to original mail
        email: userInfo.updatedEmail || userInfo.email || ''
      });

      return;
    }

    this.setState({
      isOpen: props.isOpen || false
    });
  }

  renderHeader(t, userInfo) {
    const { name, photoURL } = userInfo;

    return (
      <div className="modal-header">
        {photoURL &&
          <Img className="avatar" src={photoURL} alt={name}/>}
        <span>{name}</span>
      </div>
    );
  }

  renderBody(t, userInfo) {
    return (
      <div className='modal-body'>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput(t, 'email', t('user.set-my-email'), true, 'email')}
          {t('user.will-be-used')}
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

  renderInput(t, fieldName, placeholder, isEditable, fieldType) {
    const classNames = isEditable ? ' editable' : '';

    return (
      <label>
        {t('user.email')}
        <input
          className={`changing-input user-info-input ${classNames}`}
          type={fieldType}
          name={fieldName}
          value={this.state[fieldName]}
          placeholder={placeholder}
          ref={e => this.inputElm = e}
          onChange={this.handleChange}
          disabled={!isEditable}
          required />
      </label>
    );
  }

  handleChange(e) {
    let fieldName = e.target.name;

    this.setState({
      [fieldName]: e.target.value
    });
  }

  handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }

    const fieldsToUpdate = {
      email: this.state.email,
    };

    this.props.updateUserInfo(fieldsToUpdate);
    this.onCloseModal();
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
              <div className='set-user-info' dir={t('lang-dir')}>
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
}

SetUserInfo.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  userInfo: PropTypes.object.isRequired,
  updateUserInfo: PropTypes.func.isRequired,
  onClosed: PropTypes.func.isRequired
};


export default SetUserInfo;
