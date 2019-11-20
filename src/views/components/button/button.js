import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './button.css';

const Button = ({
  children,
  className,
  onClick,
  type = 'button',
  disabled,
  dataTour,
}) => {
  const cssClasses = classNames('button', className);
  return (
    <button
      className={cssClasses}
      onClick={onClick}
      type={type}
      disabled={disabled}
      tabIndex={0}
      data-tour={dataTour}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  dataTour: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'reset', 'submit']),
};

export default Button;
