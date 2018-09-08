import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button';
import Img from 'react-image';
import ToolTip from 'react-portal-tooltip';
import MyProfileTooltip from '../my-profile-tooltip';
import { ToastContainer } from 'react-toastify';
import { I18n, Trans } from 'react-i18next';
import { appConfig } from 'src/config/app-config'

import 'react-toastify/dist/ReactToastify.min.css'

import './header.css';
import GoogleTranslate from '../google-translate/google-translate';

const menuContent = `<div>
<Img className='avatar' src={auth.photoURL} alt={auth.name}/>
<Button onClick={signOut}>{t('header.disconnect')}</Button>
</div>`;

const Header = ({auth, signOut, isShowUpdateProfile, onShowSuccess}) => (
  <I18n ns='translations'>
   {
    (t, { i18n }) => (
    <header className='header'>
      <div className='g-row'>
        <div className='g-col'>
        <ToastContainer
            position='top-center'
            autoClose={ appConfig.notificationShowTime }
            hideProgressBar={false}
            newestOnTop={true}
            pauseOnHover
          />
        <ul className='header-actions'>
            {auth ?
              <div>
                <MyProfileTooltip
                  auth = { auth }
                  signOut = { signOut }
                  isShowUpdateProfile = { isShowUpdateProfile }
                />
                { auth.photoURL ?
                  <div className='task-item-assignee' data-html={true} data-tip={menuContent}/>
                  : <div data-html={true} data-tip={
                      <div>
                      {t('header.me')}
                      <Button onClick={signOut}>{t('header.disconnect')}</Button>
                      </div>
                    } />
                }

              </div>
              : null
            }
          </ul>
          <h1 className='header-title'><a href='/'>Doocrate</a></h1>
          <div className={`lang-select lang-${t('lang-float-reverse')}`}>
            { renderLanguageButton(t, i18n, onShowSuccess) }
          </div>
          <GoogleTranslate />
        </div>
      </div>
    </header>
    )}
  </I18n>
);

function changeLanguage(changeLang, t, i18n, onShowSuccess) {
  i18n.changeLanguage(changeLang);
  onShowSuccess('To see translated tasks - press on "Select language" on the top left and choose English');
}

function renderLanguageButton(t, i18n, onShowSuccess) {
  const changeLang = (i18n.language === 'en') ? 'he' : 'en';

  return(
    <div>
      <button
        onClick={() => {changeLanguage(changeLang, t, i18n, onShowSuccess)}}>
        {t('nav.' + changeLang + '-lang')}
      </button>
    </div>
  )
}

Header.propTypes = {
  auth: PropTypes.object.isRequired,
  signOut: PropTypes.func.isRequired,
  isShowUpdateProfile: PropTypes.func.isRequired,
  onShowSuccess: PropTypes.func.isRequired,
};


export default Header;
