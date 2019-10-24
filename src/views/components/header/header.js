import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';
import { I18n } from 'react-i18next';
import { appConfig } from 'src/config/app-config'
import { NavLink } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.min.css'

import './header.css';
import {updateUserData} from "../../../auth/auth";
import getRandomImage from "../../../utils/unsplash";
import {SetUserInfo} from "../set-user-info";
import {getCookie} from "../../../utils/browser-utils";
import SideMenu from "../side-menu/side-menu";
import LanguageButtons from "../../atoms/language-buttons/language-buttons";

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
  }

  render() {

    return (
      <I18n ns='translations'>
        {
          (t, {i18n}) => (
            <header className='header notranslate'>
              <SideMenu auth={this.props.auth} i18n={i18n}/>
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

                  <div className='header-side'>
                    <h4 className='project-title'>{this.props.selectedProject?
                      <NavLink to={'/'+this.props.selectedProject.url+'/task/1'}>{this.props.selectedProject.name}</NavLink> :
                      ''
                    }</h4>
                    <div className={`language-buttons-wrapper lang-${i18n.language}`}>
                      <LanguageButtons
                        i18n={i18n}
                        changeLanguage={this.changeLanguage}/>
                    </div>
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

  changeLanguage = (i18n, changeLang) => {
    i18n.changeLanguage(changeLang);
    this.updateUserLanguage(changeLang);
  };

  updateUserLanguage = (language) => {
    const userData = {};
    userData.uid = this.props.auth.id;
    userData.language = language;
    updateUserData(userData);
  };

  updateUserInfo = (userInfo) => {
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

}

export default Header;
