import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './signup-login.css';
import { I18n } from 'react-i18next';
import Modal from 'react-responsive-modal';

export class SignupLogin extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      isOpen: true,
      email: '',
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
      isOpen: props.isOpen || false,
    })
  }

  render() {
    const { isOpen:isOpenProps } = this.props;
    const { isOpen:isOpenState } = this.state;

    const isOpen = isOpenProps && isOpenState;

    return (
      <I18n ns='translations'>
        {
          (t, { i18n }) => (
            <Modal open={isOpen} onClose={this.onCloseModal} center>
              <div className='signup-login' dir={t('lang-dir')}>
                <div className='modal-content'>
                  {this.renderHeader(t)}
                  {this.renderBody(t)}
                </div>
              </div>
            </Modal>
          )
        }
      </I18n>
    );
  }

  renderHeader(t) {
    return (
      <div className='modal-header'>
        <h2>{t('signin.welcome')}</h2>
        <div>{t('signin.enter-email')}</div>
    </div>
    );
  }

  renderBody(t) {
    return (
      <div className='modal-body'>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput('email', t('signin.my-email'), true, 'email')}
          {this.renderSubmit(t)}
        </form>
      </div>
    );
  }

  renderSubmit(t) {
    return (
      <div className={'submit-wrapper'}>
        <input className={`button button-small` }
               type="submit" value={t('signin.submit')}/>
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

    this.props.sendMagicLink(this.state.email);
    this.onCloseModal();
  }

}

SignupLogin.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  sendMagicLink: PropTypes.func.isRequired,
  onClosed: PropTypes.func.isRequired
};


export default SignupLogin;
