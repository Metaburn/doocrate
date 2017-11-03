import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { authActions, getAuth } from 'src/auth';

import './me.css';
import LoaderUnicorn from '../../components/loader-unicorn/loader-unicorn';
import Button from '../../components/button';
import Img from 'react-image';


const Me = ({authenticated, auth, signOut}) => (
  <div className='g-row me'>
    <br/>
    <h1>האזור האישי</h1>
      { authenticated && authenticated.photoURL ? 
        <Img src='authenticated.photoURL' />
        :
        ""
      }
      { auth && auth.role != 'user' ?
        <div>תפקידך: { auth.role }</div>
        :
        ""
      }
      {auth && auth.email?
        <div>אימייל: { auth.email }</div>
        :
        ""
      }
    <br/>
  </div>
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
