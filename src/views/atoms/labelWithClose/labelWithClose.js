import React from 'react';
import PropTypes from 'prop-types';
import Icon from "src/views/atoms/icon";
import { I18n } from 'react-i18next';

import './labelWithClose.css';
import Label from "../label/label";

class LabelWithClose extends React.Component {
  render() {
    return (
      <I18n ns='translations'>
        {
          (t, {i18n}) => (
            <Label
              key={this.props.label}
              label={this.props.label}
              backgroundColor={this.props.backgroundColor}>

              {this.renderCloseBtn()}

            </Label>
          )}
      </I18n>
    );
  }

  renderCloseBtn = () => {
    return (
      <button className={'close-button'} onClick={()=> { this.props.onClear(this.props.extra, this.props.label)}}>
        <Icon name={'close'} alt={'Clear'}/>
      </button>
    )
  };
}

LabelWithClose.propTypes = {
  onClear: PropTypes.func,
  extra: PropTypes.string, // Used to pass more info to the onClear handler
  label: PropTypes.string,
  backgroundColor: PropTypes.string
};

export default LabelWithClose;
