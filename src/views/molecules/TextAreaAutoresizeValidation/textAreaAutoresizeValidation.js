import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import i18n from "src/i18n";
import TextareaAutosize from "react-textarea-autosize";
import { Textarea } from "react-inputs-validation";

import "./textAreaAutoresizeValidation.css";

class TextAreaAutoresizeValidation extends Component {

  render() {
    const {fieldName, isEditable, placeHolder, isRequired,
      onValidationChange, validate, onTextBoxChange } = this.props;
    const classNames = isEditable ? " editable" : "";

    // Since we are using a custom control we need to perform our own validation method
    const validateTextArea = (value) => {
      if(isRequired) {
        const isValid = (value !== undefined && value !== "" && value.length > 0);
        onValidationChange(fieldName, !isValid);
      }
    };

    const msgOnError = i18n.t("task.errors.not-empty");

    return (
      <Fragment>
        <TextareaAutosize
          className={`changing-input${classNames}`}
          name={fieldName}
          tabIndex={"0"}
          value={this.props.value}
          placeholder={placeHolder}
          ref={(e) => this[fieldName+"Input"] = e}
          inputRef={tag => (this[fieldName+"Input"] = tag)}
          onChange={(o) => { validateTextArea(o.target.value); onTextBoxChange(o)}}
          onBlur={(e) => { validateTextArea(this.props.value)} }
          onKeyUp={() => {}} // here to trigger validation callback on Key up
          disabled={!isEditable}/>

        {/* We are using 2 text area to have both autoresize and validation and hiding the validation one */}
        <Textarea
          classNameInput={"hidden"}
          value={this.props.value}
          onChange={() => {}}
          onBlur={(e) => {}} // here to trigger validation callback on Key up
          validate={validate}
          validationOption={{check: true, required: isRequired, msgOnError: msgOnError }}
          validationCallback={(res) => validateTextArea(this.props.value)}
        />


      </Fragment>
    );
  }

}

TextAreaAutoresizeValidation.defaultProps = {
  isRequired: false
};

TextAreaAutoresizeValidation.propTypes = {
  fieldName: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeHolder: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  isEditable: PropTypes.bool,
  validate: PropTypes.bool,
  validations: PropTypes.object,
  onTextBoxChange: PropTypes.func.isRequired,
  onValidationChange:  PropTypes.func.isRequired,
};

export default TextAreaAutoresizeValidation
