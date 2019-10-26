import React, {Component, Fragment} from 'react';
import PropTypes from "prop-types";

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';
import EditorPreview from "../editor-preview/editor-preview";

import './richTextEditor.css';

class RichTextEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: '',
    };
  }

  componentWillMount() {
    this.setState({data: this.props.data})
  }

  render() {
    const {isEditing,i18n} = this.props;

    return (
      <div className={'richTextEditor'}>

        {(!isEditing &&
          <EditorPreview
            className={'editor-preview'}
            data={this.state.data}
            onClick={this.props.onToggleEditing}/>)}

        {/* We modify the alignment to rtl language if the user set language to hebrew by setting 'content' */}
        {(isEditing &&
          <CKEditor
            editor={ClassicEditor}
            data={this.state.data}
            config={{
              toolbar: ["heading", "|", "bold", "italic", "link", "bulletedList",
                "numberedList", "blockQuote", "mediaEmbed",
                "undo", "redo"],
              language: {ui: 'en', content: i18n.language}
            }}
            onChange={this.props.onChange}
          />
        )}
      </div>
    )
  }
}

RichTextEditor.propTypes = {
  onToggleEditing: PropTypes.func,
  onChange: PropTypes.func,
  data: PropTypes.string,
  isEditing: PropTypes.bool.isRequired,
  i18n: PropTypes.object.isRequired,
};

export default RichTextEditor;
