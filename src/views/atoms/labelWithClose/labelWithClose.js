import React from 'react';
import PropTypes from 'prop-types';
import Icon from "src/views/components/icon";
import { I18n } from 'react-i18next';

import './label.css';

class Label extends React.Component {
  render() {
    const backgroundColor = this.props.backgroundColor || '#999';
    return (
      <I18n ns='translations'>
        {
          (t, {i18n}) => (
            <div key={this.props.label}
                 style={{'backgroundColor': `${backgroundColor}`}}
                 className='label-wrapper'
                 onClick={this.props.onClick} >
              <span className={`label-text label-text-${t('lang-float')}`}>
                {this.props.label}
              </span>
              {this.props.onClear && this.renderCloseBtn()}
            </div>
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

// A label can have an onClear which would add an 'X' to it.
// And alternatively an onClick - which would listen to a click event on that label
Label.propTypes = {
  onClear: PropTypes.func,
  extra: PropTypes.string, // Used to pass more info to the onClear handler
  onClick: PropTypes.func,
  label: PropTypes.string,
  backgroundColor: PropTypes.string,};

export default Label;
