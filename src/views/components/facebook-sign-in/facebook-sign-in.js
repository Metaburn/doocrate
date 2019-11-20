import React from 'react';

import './facebook-sign-in.css';
import PropTypes from 'prop-types';

const FacebookSignIn = ({ children, className, onClick, disabled }) => {
  return (
    <button
      className="facebookSignIn"
      onClick={onClick}
      disabled={disabled}
      tabIndex={0}
    >
      {children}
    </button>
  );
};

FacebookSignIn.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default FacebookSignIn;
