import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button';
import Img from 'react-image';
import ToolTip from 'react-portal-tooltip';
import MyProfileTooltip from '../my-profile-tooltip';
import { ToastContainer } from 'react-toastify';
import { I18n, Trans } from 'react-i18next';

import 'react-toastify/dist/ReactToastify.min.css'

import './header.css';

const menuContent = `<div>
<Img className='avatar' src={auth.photoURL} alt={auth.name}/>
<Button onClick={signOut}>{t('header.disconnect')}</Button>
</div>`;

const Header = ({auth, signOut, isShowUpdateProfile}) => (
  <I18n ns='translations'>
   {
    (t, { i18n }) => (
    <header className='header'>
      <div className='g-row'>
        <div className='g-col'>
        <ToastContainer
            position='top-right'
            autoClose={5000}
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
            { renderLanguageButton(t, i18n) }
          </div>

        </div>
      </div>
    </header>
    )}
  </I18n>
);

function renderLanguageButton(t, i18n) {
  const changeLang = (i18n.language === 'en') ? 'he' : 'en'

  return(
    <div>
      <button
        onClick={() => { i18n.changeLanguage(changeLang)}}>{t(`nav.${changeLang}-lang`)}
      </button>
    </div>
  )
}

Header.propTypes = {
  auth: PropTypes.object.isRequired,
  signOut: PropTypes.func.isRequired,
  isShowUpdateProfile: PropTypes.func.isRequired,
};


export default Header;
