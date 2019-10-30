import React, {Component} from 'react';
import PropTypes from "prop-types";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';
import EditorPreview from "../editor-preview/editor-preview";
import i18n from 'src/i18n';

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
    const {isEditing, onToggleEditing, onBlur, onChange} = this.props;
    const { data } = this.state;

    return (
      <div className={'rich-text-editor'}>

        {(!isEditing &&
          <EditorPreview
            className={'editor-preview'}
            data={data}
            onClick={onToggleEditing}/>)}

        {/* We modify the alignment to rtl language if the user set language to hebrew by setting 'content' */}
        {(isEditing &&
          <CKEditor
            editor={ClassicEditor}
            data={data}
            config={{
              toolbar: ["heading", "|", "bold", "italic", "link", "bulletedList",
                "numberedList", "blockQuote", "mediaEmbed",
                "undo", "redo"],
              language: {ui: 'en', content: i18n.language}
            }}
            onBlur={onBlur}
            onChange={onChange}
          />
        )}
      </div>
    )
  }
}

RichTextEditor.propTypes = {
  onToggleEditing: PropTypes.func,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  data: PropTypes.string,
  isEditing: PropTypes.bool.isRequired,
};

export default RichTextEditor;
