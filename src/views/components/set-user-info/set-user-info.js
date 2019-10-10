import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './set-user-info.css';
import Img from 'react-image';
import { I18n } from 'react-i18next';
import Modal from 'react-responsive-modal';
import getRandomImage from 'src/utils/unsplash';


export class SetUserInfo extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      isOpen: true,
      email: '',
      name: '',
      photoURL: '',
      originalEmail: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
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

    if(this.state.originalEmail !== props.userInfo.updatedEmail &&
        this.state.originalEmail !== props.userInfo.email) {

      this.setState({
        originalEmail: props.userInfo.updatedEmail || props.userInfo.email,
        // First try to see if there is an updated mail.
        // Otherwise revert to original mail
        email: props.userInfo.updatedEmail || props.userInfo.email || '',
        name: props.userInfo.name || '',
        isOpen: props.isOpen || false,
        photoURL: props.photoURL || ''
      });
      return
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
              <div className='set-user-info' dir={t('lang-dir')}>
                <div className='modal-content'>
                  <div className='modal-header'/>
                  {this.renderBody(t)}
                </div>
              </div>
            </Modal>
          )
        }
      </I18n>
    );
  }

  renderBody(t) {
    const { name } = this.props.userInfo;
    const photoURL = this.state.photoURL;
    const avatar = photoURL ? <Img className={`avatar avatar-${t('lang-float')}`} src={photoURL} alt={name} onClick={this.handleImageClick}/> : '';

    return (
      <div className='modal-body'>
        <h1>Let's get you set up</h1>
        <form className='modal-form' onSubmit={this.handleSubmit}>
          <div className={'avatar-wrapper'}>
            { avatar }
            <span className={'avatar-parallel'}>
              <span><b>{t('user.email')}</b></span>
              <span className={'flex-rows-break'}/>
              {this.renderInput('email', t('user.set-my-email'), true, 'email')}
              <span><b>{t('user.set-my-name-description')}</b></span>
              {this.renderInput('name', t('user.set-my-name'), true, 'name')}
            </span>
          </div>
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

  handleImageClick(event) {
    // Roll a random image - 250 to 300 (Resolution)
    this.setState({
      photoURL: getRandomImage()
    });
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
      name: this.state.name,
      photoURL: this.state.photoURL
    };

    this.props.updateUserInfo(fieldsToUpdate);
    this.onCloseModal();
  }

}

SetUserInfo.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  userInfo: PropTypes.object.isRequired,
  photoURL: PropTypes.string.isRequired,
  updateUserInfo: PropTypes.func.isRequired,
  onClosed: PropTypes.func.isRequired
};


export default SetUserInfo;


