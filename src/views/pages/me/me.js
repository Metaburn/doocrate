import React from 'react';
import { connect } from 'react-redux';
import { authActions } from 'src/auth';
import { NavLink } from 'react-router-dom';

import Img from 'react-image';
import { I18n } from 'react-i18next';
import './me.css';

const Me = ({authenticated, auth, selectedProject}) => (
  <I18n ns='translations'>
      {
      (t, { i18n }) => (
      <div className='g-row me'>
        <br/>
        <h1>{t('header.my-space')}</h1>
          { authenticated && authenticated.photoURL ?
            <Img src={authenticated.photoURL} />
            :
            ''
          }
          { auth && auth.role !== 'user' ?
            <div>{t('my-space.role')}: { auth.role }</div>
            :
            ''
          }
          {auth && auth.email?
            <div>{t('my-space.email')}: { auth.updatedEmail }</div>
            :
            ''
          }
          { auth.role === 'admin' &&
          selectedProject ?
            <NavLink to={`/${selectedProject.url}/reports`}>{t('my-space.reports')}</NavLink>
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
    selectedProject: state.projects.selectedProject
  }
};

const mapDispatchToProps = Object.assign(
  {},
  authActions,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Me);
