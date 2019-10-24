import React from 'react';
import PropTypes from 'prop-types';

import './loader-unicorn.css';

const LoaderUnicorn = ({ isShow }) => {
  const componentClasses = ['loader-unicorn'];
  if(!isShow) { componentClasses.push('hideme'); }

  return(
    <div className={componentClasses.join(' ')} />
  );
};

LoaderUnicorn.propTypes = {
  isShow: PropTypes.bool.isRequired
};

export default LoaderUnicorn;
