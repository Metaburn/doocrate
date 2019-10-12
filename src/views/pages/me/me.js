import React, {Component, Fragment} from 'react';
import { NavLink } from 'react-router-dom';

import Img from 'react-image';
import { I18n } from 'react-i18next';
import './me.css';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import { updateUserData } from "src/auth/auth";
import i18n from "../../../i18n";
import { notificationActions } from "../../../notification";
import EditorPreview from "../../components/editor-preview/editor-preview";
import {createSelector} from "reselect";
import {getAuth} from "../../../auth";
import Icon from 'src/views/components/icon';
import Button from "../../components/button/button";

export class Me extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      bio: '',
      user: null,
      isEditing: false
    };
  }

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

    this.setState({bio: props.auth.bio, user: props.user});
  }

  toggleEditing = () => {
    this.setState({isEditing:!this.state.isEditing});
  };

  render() {
    const auth = this.props.auth;

    return (
      <I18n ns='translations'>
        {
          (t, {i18n}) => (
            <div className='g-row me notranslate'>
              <br/>
              {this.props.user? this.props.user.name: ''}
              <h1>{t('header.my-space')}</h1>
              {auth && auth.email ?
                <div>{t('my-space.email')}: {auth.updatedEmail}</div>
                :
                ''
              }
              {auth && auth.photoURL ?
                <div className={'avatar-wrapper'}>
                  <Img className={'avatar'} src={auth.photoURL}/>
                </div>
                :
                ''
              }

              <Button onClick={ this.toggleEditing}>
                <Icon name='edit' alt={i18n.t('general.click-to-edit')}/>
              </Button>

              <form className='user-form' onSubmit={this.handleSubmit}>
                <span className={'bio-description'}>{t('user.bio-description')}</span>
                {this.renderBio(t)}
                {this.renderSubmit(t)}
              </form>

              {auth && auth.role !== 'user' ?
                <div>{t('my-space.role')}: {auth.role}</div>
                :
                ''
              }
              { this.renderAdminProjects(t)}
              <br/>
            </div>
          )}
      </I18n>
    )
  }

  onEditorChange = (event, editor) => {
    this.setState({
      bio: editor.getData()
    });
  };

  renderBio(t) {
    if(!this.state.bio && !this.state.isEditing) {
      return (<span>
        {t('my-space.bio-empty')}
        <Button className={'button-as-link'} onClick={ this.toggleEditing }>{t('my-space.bio-empty-action')}</Button>
        {t('my-space.bio-empty-encourage')}
      </span>);
    }

    if (!this.state.isEditing) {
      return <EditorPreview
        className={'editor-preview'}
        data={this.state.bio}
      onClick={this.toggleEditing}/>
    }

    // We modify the alignment to rtl language if the user set language to hebrew by setting 'content'
    return (
      <Fragment>
        <CKEditor
          editor={ClassicEditor}
          data={this.state.bio}
          config={{
            toolbar: ["heading", "|", "bold", "italic", "link", "bulletedList",
              "numberedList", "blockQuote", "mediaEmbed",
              "undo", "redo"],
            language: {ui: 'en',content: i18n.language}
          }}
          onChange={this.onEditorChange}
        />
      </Fragment>
    );
  }

  renderSubmit(t) {
    return (
      <div className={'submit-wrapper'}>
        <input className={`button button-small`}
               type="submit" value={t('user.submit')}/>
      </div>
    );
  }

  handleSubmit = (event) => {
    if(event) {
      event.preventDefault();
    }

    const fieldsToUpdate = {
      uid: this.props.auth.id,
      bio: this.state.bio,
    };

    updateUserData(fieldsToUpdate);
    this.props.showSuccess(i18n.t('my-space.updated-successfully'));
    this.props.history.goBack();
  };

  renderAdminProjects = (t) => {
    const auth = this.props.auth;
    if (!auth || !auth.adminProjects || auth.adminProjects.size <= 0)
      return;

    return (
      <div className={'projects'}>
        {
          auth.adminProjects.map(project => {
            return (
              <div className={'project'} key={project}>
                <span>{project}</span>
                <span><NavLink to={`/${project}/reports`}>{t('my-space.project-report')}</NavLink></span>
                <span><NavLink to={`/${project}/edit`}>{t('my-space.edit-project')}</NavLink></span>
              </div>
            )
          })
        }
      </div>
    )
  }
}

Me.propTypes = {
  auth: PropTypes.object.isRequired,
  showSuccess: PropTypes.func.isRequired,
};


//=====================================
//  CONNECT
//-------------------------------------
const mapStateToProps = createSelector(
  getAuth,
  (auth) => ({
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
)(Me);
