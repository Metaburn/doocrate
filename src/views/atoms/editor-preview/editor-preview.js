import React from 'react';
import PropTypes from 'prop-types';

const EditorPreview = ({ data, onClick, className}) => (
  <div onClick={onClick}
       className={className}
       dangerouslySetInnerHTML={{__html: data}}/>
);

EditorPreview.propTypes = {
  data: PropTypes.string
};

export default EditorPreview;
