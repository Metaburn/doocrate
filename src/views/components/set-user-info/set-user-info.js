import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import Img from 'react-image';
import Modal from 'react-responsive-modal';
import getRandomImage from 'src/utils/unsplash';
import RichTextEditor from "../../atoms/richTextEditor/richTextEditor";
import i18n from 'src/i18n';

import './set-user-info.css';

export class SetUserInfo extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      isOpen: true,
      includingBio: false,
      email: '',
      bio: '',
      name: '',
      photoURL: '',
      originalEmail: ''
    };

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
        bio: props.userInfo.bio || '',
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
      <Modal open={isOpen} onClose={this.onCloseModal} center>
        <div className='set-user-info' dir={i18n.t('lang-dir')}>
          <div className='modal-content'>
            <div className='modal-header'>
              <h1>{i18n.t('user.title')}</h1>
            </div>
            {this.renderBody()}
          </div>
        </div>
      </Modal>
    );
  }

  renderBody() {
    const { name } = this.props.userInfo;
    const photoURL = this.state.photoURL;
    const avatar = photoURL ? <Img className={`avatar avatar-${i18n.t('lang-float')}`} src={photoURL} alt={name} onClick={this.handleImageClick}/> : '';

    return (
      <div className='modal-body'>
        <form className='modal-form' onSubmit={this.handleSubmit}>
          <div className={'avatar-wrapper'}>
            { avatar }
            <span className={'avatar-parallel'}>
              <span><b>{i18n.t('user.email')}</b></span>
              <span className={'flex-rows-break'}/>
              {this.renderInput('email', i18n.t('user.set-my-email'), true, 'email')}
              <span><b>{i18n.t('user.set-my-name-description')}</b></span>
              {this.renderInput('name', i18n.t('user.set-my-name'), true, 'name')}
              {this.props.includingBio && this.renderBio()}
            </span>
          </div>
          {this.renderSubmit()}
        </form>
      </div>
    );
  }

  renderBio = () => {
    return(
      <Fragment>
        <span><b>{i18n.t('user.bio-description')}</b></span>

        <RichTextEditor
        data={this.state.bio}
        isEditing={true}
        onChange={this.onBioEditorChange}
        onToggleEditing={this.onToggleEditing}/>

      </Fragment>
        );
  };

  onBioEditorChange = (event, editor) => {
    this.setState({
      bio: editor.getData()
    });
  };

  renderSubmit() {
    return (
      <div className={'submit-wrapper'}>
        <input className={`button button-small` }
               type="submit" value={i18n.t('user.submit')}/>
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

  handleImageClick = () =>{
    // Roll a random image
    this.setState({
      photoURL: getRandomImage()
    });
  };

  handleChange = (e) => {
    let fieldName = e.target.name;
    this.setState({
      [fieldName]: e.target.value
    });
  };

  handleSubmit = (event) => {
    if(event) {
      event.preventDefault();
    }
    const fieldsToUpdate = {
      email: this.state.email,
      name: this.state.name,
      bio: this.state.bio,
      photoURL: this.state.photoURL
    };

    this.props.updateUserInfo(fieldsToUpdate);
    this.onCloseModal();
  };

}

SetUserInfo.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  includingBio: PropTypes.bool.isRequired,
  userInfo: PropTypes.object.isRequired,
  photoURL: PropTypes.string.isRequired,
  updateUserInfo: PropTypes.func.isRequired,
  onClosed: PropTypes.func.isRequired
};


export default SetUserInfo;


