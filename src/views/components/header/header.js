import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';
import { I18n } from 'react-i18next';
import { appConfig } from 'src/config/app-config'
import { NavLink } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.min.css'

import './header.css';
import GoogleTranslate from '../google-translate/google-translate';
import {updateUserData} from "../../../auth/auth";
import HeaderActions from "../header-actions/header-actions";
import getRandomImage from "../../../utils/unsplash";
import {SetUserInfo} from "../set-user-info";
import {getCookie} from "../../../utils/browser-utils";
import SideMenu from "../side-menu/side-menu";

class Header extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    signOut: PropTypes.func.isRequired,
    isShowUpdateProfile: PropTypes.func.isRequired,
  };

  constructor() {
    super(...arguments);

    this.state = {
      shouldGoogleTranslateToEnglish: false,
      showSetUserInfoScreen: false
    };

    this.renderLanguageButton = this.renderLanguageButton.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
    this.updateUserLanguage = this.updateUserLanguage.bind(this);
  }

  render() {
    const projectToUse = (this.props.selectedProject && this.props.selectedProject.url !== 'undefined')?
      this.props.selectedProject.url : this.props.auth.defaultProject;

    return (
      <I18n ns='translations'>
        {
          (t, {i18n}) => (
            <header className='header notranslate'>
              <SideMenu auth={this.props.auth}/>
              <div className={'header-wrapper'}>
                <div>
                  <ToastContainer
                    position='top-center'
                    autoClose={appConfig.notificationShowTime}
                    hideProgressBar={false}
                    newestOnTop={true}
                    pauseOnHover
                  />

                  <SetUserInfo
                    isOpen = { (this.state.showSetUserInfoScreen) || this.props.auth.shouldShowUpdateProfile}
                    userInfo={ this.props.auth }
                    photoURL={ this.props.auth.photoURL || getRandomImage()}
                    updateUserInfo={ this.updateUserInfo }
                    onClosed = { () => {
                      this.setState({showSetUserInfoScreen: false});
                      this.props.isShowUpdateProfile(false);
                      this.setState({showSetUserInfoScreen: false})
                    }
                    } />

                  <HeaderActions
                    auth={this.props.auth}
                    signOut={this.props.signOut}
                    projectUrl={projectToUse}
                    isShowUpdateProfile={this.props.isShowUpdateProfile}/>

                  <div className='header-side'>
                    <h4 className='project-title'>{this.props.selectedProject?
                      <NavLink to={'/'+this.props.selectedProject.url+'/task/1'}>{this.props.selectedProject.name}</NavLink> :
                      ''
                    }</h4>
                    <div className={`lang-select lang-left`}>
                      {this.renderLanguageButton(t, i18n)}
                    </div>
                    <GoogleTranslate
                    shouldClose={ this.props.shouldClose }
                    shouldGoogleTranslateToEnglish= {this.state.shouldGoogleTranslateToEnglish}/>
                  </div>
                </div>
              </div>
            </header>
          )}
      </I18n>
    );
  }

  componentWillMount() {
    this.showSetUserInfo();
  }


  showSetUserInfo() {
    this.setState({showSetUserInfoScreen: (this.props.auth.id && !this.props.auth.isEmailConfigured)})
  }

  changeLanguage(changeLang, t, i18n) {
    i18n.changeLanguage(changeLang);
    this.updateUserLanguage(changeLang);
  }

  updateUserInfo(userInfo) {
    const projectCookie = getCookie('project');

    const oldUserData = this.props.auth;
    const newUserData = {};
    newUserData.uid = oldUserData.id;
    newUserData.email = userInfo.email;
    newUserData.isEmailConfigured = true; //This is the flag that specify that this module should not show anymore
    newUserData.displayName = userInfo.name;
    newUserData.photoURL = userInfo.photoURL;
    newUserData.bio = userInfo.bio;
    // Update the default project on first time setting user info
    newUserData.defaultProject = projectCookie || this.props.selectedProject;
    updateUserData(newUserData);
  }

  updateUserLanguage(language) {
    const userData = {};
    userData.uid = this.props.auth.id;
    userData.language = language;
    updateUserData(userData);
  }

  setGoogleTranslateToEnglishIfNeeded(shouldTranslate){
    // If the project is in hebrew we also translate the tasks auto-magically using google translate
    if(this.props.selectedProject &&
      this.props.selectedProject.language &&
      // Only for project who are not english by default
      this.props.selectedProject.language.value !== 'en') {

      this.setState({shouldGoogleTranslateToEnglish: shouldTranslate});
    }
  }

  renderLanguageButton(t, i18n) {
    return (
      <div>
        <button className={'notranslate button-as-link'} onClick={() => {
            this.changeLanguage('en', t, i18n);
            this.setGoogleTranslateToEnglishIfNeeded(true);
          }}>
          {t('nav.en-lang-short')}
        </button>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <button className={'notranslate button-as-link'} onClick={() => {
          this.changeLanguage('he', t, i18n);
          this.setGoogleTranslateToEnglishIfNeeded(false);
        }}>
          {t('nav.he-lang-short')}
        </button>
      </div>
    )
  }
}

export default Header;
