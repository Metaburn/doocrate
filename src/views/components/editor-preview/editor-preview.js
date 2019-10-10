import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EmbedContainer from 'react-oembed-container';


class EditorPreview extends Component {
  render() {
    return (
      <div className="editor-preview">
        <EmbedContainer markup={this.props.data}>
          <div dangerouslySetInnerHTML={{__html: this.props.data}}/>
        </EmbedContainer>
      </div>
    );
  }
}

EditorPreview.defaultProps = {
  data: ''
};

EditorPreview.propTypes = {
  data: PropTypes.string
};

export default EditorPreview;
