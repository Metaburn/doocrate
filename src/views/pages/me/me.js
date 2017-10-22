import React from 'react';
import PropTypes from 'prop-types';

import './me.css';
import LoaderUnicorn from '../../components/loader-unicorn/loader-unicorn';
import Button from '../../components/button';
import Img from 'react-image';

const Me = ({authenticated, signOut}) => (
  <div className='g-row me'>
    <br/>
    <h1>האזור האישי</h1>
      { authenticated && authenticated.photoURL ? 
        <Img src='authenticated.photoURL' />
        :
        ""
      }
    <br/>
    בקרוב תוכל לעדכן מפה מייל
  </div>
);

Me.propTypes = {
};


export default Me;
