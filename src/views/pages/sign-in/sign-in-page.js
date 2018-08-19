import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { authActions } from 'src/auth';
import Button from 'src/views/components/button';
import Img from 'react-image';
import Icon from 'src/views/components/icon';
import { NavLink } from 'react-router-dom';
import { I18n } from 'react-i18next';

import './sign-in-page.css';


const SignInPage = ({signInWithFacebook, signInWithGoogle}) => {
  return (
    <I18n ns='translations'>
      {
      (t, { i18n }) => (
      <div className="g-row sign-in">
        <div className="g-col">
          <h1 className="sign-in__heading">
            {t('welcome.heading')}
          </h1>
          <h3 className="sign-in__heading">
            {t('welcome.heading2')}
          </h3>
          <div className='sign-in__content'>
            <h3 className='before-about'>
            {t('welcome.registration')}
            </h3>
            <h5 className='about-header'>
            (<NavLink to='/about'> {t('welcome.about')} ></NavLink>)
            </h5>
            <br />
            <h3>
              {t('welcome.before-start')}
            </h3>
            <h3>
              {t('welcome.old_system')}&nbsp;
               (<a href ={t('welcome.old_system_url')}>{t('welcome.click_here')}</a>)
            </h3>
            <h3>
            <Icon name='done' className='grow done' />
              {t('welcome.instruction1')}
            </h3>
            <h3>
            <Icon name='done' className='grow done' />
              {t('welcome.instruction2')}
            </h3>
            <h3>
            <Icon name='done' className='grow done' />
              {t('welcome.instruction3')}
            </h3>
            <h3>
            <Icon name='done' className='grow done' />
              {t('welcome.instruction4')}
            </h3>
            <h3>
            <Icon name='done' className='grow done' />
              {t('welcome.instruction5')}
            </h3>
            <h3>
              {t('welcome.instruction6')}
            </h3>
            <div className='sign-in-buttons'>
              <Button className="sign-in__button" onClick={signInWithGoogle}>{t('welcome.google-login')}</Button>
              <Button className="sign-in__button" onClick={signInWithFacebook}>{t('welcome.facebook-login')}</Button>
          </div>
          <br/>
          <br/>
          </div>
        </div>
      </div>
    )}
    </I18n>
  );
};

SignInPage.propTypes = {
  signInWithFacebook: PropTypes.func.isRequired,
  signInWithGoogle: PropTypes.func.isRequired,
};


//=====================================
//  CONNECT
//-------------------------------------

const mapDispatchToProps = {
  signInWithFacebook: authActions.signInWithFacebook,
  signInWithGoogle: authActions.signInWithGoogle,
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(SignInPage)
);
