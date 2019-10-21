import React from 'react';
import PropTypes from 'prop-types';
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
                 onClick={()=> this.onClick()}>
              <span className={`label-text label-text-${t('lang-float')}`}>
                {this.props.label}
              </span>

              {this.props.children}
            </div>
          )}
      </I18n>
    );
  }

  // Optional if defined fires an onclick for that label
  onClick() {
    if(!this.props.onClick) return;
    this.props.onClick(this.props.label);
  }
}

Label.propTypes = {
  label: PropTypes.string,
  backgroundColor: PropTypes.string,
  onClick: PropTypes.func
};

export default Label;
