import React from 'react';
import PropTypes from 'prop-types';
import Collapsible from 'react-collapsible';

import './collapsibleContainer.css';

const CollapsibleContainer = ({ children, trigger }) => (
  <Collapsible trigger={trigger}>{children}</Collapsible>
);

CollapsibleContainer.propTypes = {
  trigger: PropTypes.string.isRequired,
};

export default CollapsibleContainer;
