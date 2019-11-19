import React from 'react';

import './google-sign-in.css';
import PropTypes from 'prop-types';

const GoogleSignIn = ({ children, className, onClick, disabled }) => {
  return (
    <button
      className="googleSignIn"
      onClick={onClick}
      disabled={disabled}
      tabIndex={0}
    >
      {children}
    </button>
  );
};

GoogleSignIn.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default GoogleSignIn;
