import React, { Component } from 'react';
import PropTypes from 'prop-types';


class EditorPreview extends Component {

  render() {
    return (
      <div dangerouslySetInnerHTML={{__html: this.props.data}}/>
    );
  }
}

EditorPreview.propTypes = {
  data: PropTypes.string
};

export default EditorPreview;
