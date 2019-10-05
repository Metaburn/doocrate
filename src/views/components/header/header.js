import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from '../button';
import MyProfileTooltip from '../my-profile-tooltip';
import { ToastContainer } from 'react-toastify';
import { I18n } from 'react-i18next';
import { appConfig } from 'src/config/app-config'
import { NavLink } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.min.css'

import './header.css';
import GoogleTranslate from '../google-translate/google-translate';
import {updateUserData} from "../../../auth/auth";

const menuContent =
  `<div>
    <Img className='avatar' src={auth.photoURL} alt={auth.name}/>
     <Button onClick={signOut}>{t('header.disconnect')}</Button>
  </div>`;

class Header extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    signOut: PropTypes.func.isRequired,
    isShowUpdateProfile: PropTypes.func.isRequired,
    onShowSuccess: PropTypes.func.isRequired,
  };

  constructor() {
    super(...arguments);

    this.state = {

    };

    this.renderLanguageButton = this.renderLanguageButton.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
  }

  render() {
    return (
      <I18n ns='translations'>
        {
          (t, {i18n}) => (
            <header className='header'>
              <div>
                <div>
                  <ToastContainer
                    position='top-center'
                    autoClose={appConfig.notificationShowTime}
                    hideProgressBar={false}
                    newestOnTop={true}
                    pauseOnHover
                  />
                  <h1 className='header-title'><a href='/'>Doocrate</a></h1>
                  <ul className='header-actions'>
                    {this.props.auth ?
                      <div>
                        <MyProfileTooltip
                          auth={this.props.auth}
                          signOut={this.props.signOut}
                          isShowUpdateProfile={this.props.isShowUpdateProfile}
                        />
                        {this.props.auth.photoURL ?
                          <div className='task-item-assignee' data-html={true} data-tip={menuContent}/>
                          : <div data-html={true} data-tip={
                            <div>
                              {t('header.me')}
                              <Button onClick={this.props.signOut}>{t('header.disconnect')}</Button>
                            </div>
                          }/>
                        }

                      </div>
                      : null
                    }
                  </ul>
                  <div className='header-side'>
                    <h4>{this.props.selectedProject?
                      <NavLink to={'/'+this.props.selectedProject.url+'/task/1'}>{this.props.selectedProject.name}</NavLink> :
                      ''
                    }</h4>
                    <div className={`lang-select lang-${t('lang-float-reverse')}`}>
                      {this.renderLanguageButton(t, i18n, this.props.onShowSuccess)}
                    </div>
                    <GoogleTranslate
                    shouldClose={ this.props.shouldClose }/>
                  </div>
                </div>
              </div>
            </header>
          )}
      </I18n>
    );
  }

  changeLanguage(changeLang, t, i18n, onShowSuccess) {
    i18n.changeLanguage(changeLang);
    this.updateUserInfo(changeLang);
    onShowSuccess('To see translated tasks - press on "Select language" on the top left and choose English');
  }

  updateUserInfo(language) {
    const userData = {};
    userData.uid = this.props.auth.id;
    userData.language = language;
    updateUserData(userData);
  }

  renderLanguageButton(t, i18n, onShowSuccess) {
    const changeLang = (i18n.language === 'en') ? 'he' : 'en';

    return (
      <div>
        <button
          onClick={() => {
            this.changeLanguage(changeLang, t, i18n, onShowSuccess)
          }}>
          {t('nav.' + changeLang + '-lang')}
        </button>
      </div>
    )
  }
}

export default Header;
