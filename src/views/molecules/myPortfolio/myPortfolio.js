import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../components/button/button';
import Icon from '../../atoms/icon/icon';
import Img from 'react-image';
import i18n from 'src/i18n';
import RichTextEditor from '../../atoms/richTextEditor';

import './myPortfolio.css';
class MyPortfolio extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bio: '',
      isEditing: false,
    };
  }

  componentWillMount() {
    this.setState({ bio: this.props.auth.bio });
  }

  render() {
    const { auth } = this.props;

    return (
      <div className="my-portfolio">
        {auth && auth.photoURL && (
          <div className={'avatar-wrapper'}>
            <Img className={'avatar'} src={auth.photoURL} />
          </div>
        )}
        {auth && auth.name && (
          <span className={'user-name'} onClick={this.showUpdateProfile}>
            <Button className={'edit-email'} onClick={this.showUpdateProfile}>
              <Icon name="edit" alt={i18n.t('general.click-to-edit')} />
            </Button>
            {auth.name}
          </span>
        )}

        <form className="user-form" onSubmit={this.handleSubmit}>
          {this.renderBio()}
        </form>
      </div>
    );
  }

  onEditorChange = (event, editor) => {
    this.setState({
      bio: editor.getData(),
    });
  };

  showUpdateProfile = () => {
    this.props.isShowUpdateProfile(true, true);
  };

  renderBio() {
    if (!this.state.bio && !this.state.isEditing) {
      return (
        <span>
          {i18n.t('my-space.bio-empty')}
          &nbsp;
          <Button className={'button-as-link'} onClick={this.showUpdateProfile}>
            {i18n.t('my-space.bio-empty-action')}
          </Button>
          &nbsp;
          {i18n.t('my-space.bio-empty-encourage')}
        </span>
      );
    }

    return (
      <RichTextEditor
        data={this.state.bio}
        isEditing={this.state.isEditing}
        onChange={this.onEditorChange}
        onBlur={this.handleSubmit}
        onToggleEditing={this.showUpdateProfile}
      />
    );
  }

  handleSubmit = event => {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    const fieldsToUpdate = {
      uid: this.props.auth.id,
      bio: this.state.bio,
    };

    this.setState({ isEditing: false });

    this.props.updateUserData(fieldsToUpdate);
  };
}

MyPortfolio.propTypes = {
  auth: PropTypes.object.isRequired,
  showSuccess: PropTypes.func.isRequired,
  updateUserData: PropTypes.func.isRequired,
  isShowUpdateProfile: PropTypes.func.isRequired,
};

export default MyPortfolio;
