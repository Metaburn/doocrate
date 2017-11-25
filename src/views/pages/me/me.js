import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { authActions, getAuth } from 'src/auth';
import { NavLink } from 'react-router-dom';

import LoaderUnicorn from '../../components/loader-unicorn/loader-unicorn';
import Button from '../../components/button';
import Img from 'react-image';
import { I18n } from 'react-i18next';
import './me.css';

const Me = ({authenticated, auth, signOut}) => (
  <I18n ns='translations'>
      {
      (t, { i18n }) => (
      <div className='g-row me'>
        <br/>
        <h1>{t('header.my-space')}</h1>
          { authenticated && authenticated.photoURL ?
            <Img src='authenticated.photoURL' />
            :
            ''
          }
          { auth && auth.role != 'user' ?
            <div>{t('my-space.role')}: { auth.role }</div>
            :
            ''
          }
          {auth && auth.email?
            <div>{t('my-space.email')}: { auth.email }</div>
            :
            ''
          }
          { auth.role == 'admin' ?
            <NavLink to='/reports'>{t('my-space.reports')}</NavLink>
            :
            ''
          }
        <br/>
      </div>
    )}
  </I18n>
);

Me.propTypes = {
};


//=====================================
//  CONNECT
//-------------------------------------
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  }
}

const mapDispatchToProps = Object.assign(
  {},
  authActions,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Me);
