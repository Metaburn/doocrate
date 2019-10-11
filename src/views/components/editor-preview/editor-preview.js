import React from 'react';
import PropTypes from 'prop-types';

const EditorPreview = ({ data }) => (<div dangerouslySetInnerHTML={{__html: data}}/>);

EditorPreview.propTypes = {
  data: PropTypes.string
};

export default EditorPreview;
