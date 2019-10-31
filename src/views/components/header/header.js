import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';
import { I18n } from 'react-i18next';
import { appConfig } from 'src/config/app-config'
import { NavLink } from 'react-router-dom';
import {updateUserData} from "../../../auth/auth";
import getRandomImage from "../../../utils/unsplash";
import {SetUserInfo} from "../set-user-info";
import {getCookie} from "../../../utils/browser-utils";
import SideMenu from "../side-menu/side-menu";
import LanguageButtons from "../../atoms/language-buttons/language-buttons";
import TourDoocrate from "../../atoms/tourDoocrate/tourDoocrate";

import "react-toastify/dist/ReactToastify.min.css";
import "./header.css";

class Header extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      shouldGoogleTranslateToEnglish: false,
      showSetUserInfoScreen: false
    };
  }

  render() {
    const { auth, isShowUpdateProfile, selectedProject, tour } = this.props;
    const { showSetUserInfoScreen } = this.state;
    return (
      <I18n ns='translations'>
        {
          (t, {i18n}) => (
            <header className='header notranslate'>
              <SideMenu auth={auth} i18n={i18n} />
              <div className={'header-wrapper'}>
                <div>
                  <ToastContainer
                    position='top-center'
                    autoClose={appConfig.notificationShowTime}
                    hideProgressBar={false}
                    newestOnTop={true}
                    pauseOnHover
                  />

                  <TourDoocrate
                    tour={tour}
                    onCloseTour={() => {this.props.setTour(false, 0)}}/>

                  <SetUserInfo
                    isOpen = { (showSetUserInfoScreen) ||
                    (auth.shouldShowUpdateProfile && auth.shouldShowUpdateProfile.show) }
                    userInfo={ auth }
                    includingBio={auth.shouldShowUpdateProfile && auth.shouldShowUpdateProfile.includingBio }
                    photoURL={ auth.photoURL || getRandomImage()}
                    updateUserInfo={ this.updateUserInfo }
                    onClosed = { () => {
                      this.setState({showSetUserInfoScreen: false});
                      isShowUpdateProfile(false);
                      this.setState({showSetUserInfoScreen: false})
                    }}
                    i18n={i18n}
                    />

                  <div className={`header-side lang-${i18n.language}`}>
                    <h4 className='project-title'>{selectedProject?
                      <NavLink to={'/'+selectedProject.url+'/task/1'}>{selectedProject.name}</NavLink> :
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
    const { auth } = this.props;
    this.setState({showSetUserInfoScreen: (auth.id && !auth.isEmailConfigured)})
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

Header.props = {
  auth: PropTypes.object.isRequired,
  signOut: PropTypes.func.isRequired,
  isShowUpdateProfile: PropTypes.func.isRequired,
  setTour: PropTypes.func.isRequired,
  tour: PropTypes.object.isRequired,
};

export default Header;
