import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './button.css';


const Button = ({children, className, onClick, type = 'button', disabled}) => {
  const cssClasses = classNames('button', className);
  return (
    <button className={cssClasses} onClick={onClick} type={type} disabled={disabled} tabIndex={0}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'reset', 'submit']),
};


export default Button;
