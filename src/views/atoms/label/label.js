import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'src/i18n';

import classNames from 'classnames';

import './label.css';

class Label extends React.Component {
  render() {
    const labelClasses = classNames('label-wrapper', {
      clickable: this.props.onClick,
    });
    const backgroundColor = this.props.backgroundColor || '#999';
    return (
      <div
        key={this.props.label}
        style={{ backgroundColor: `${backgroundColor}` }}
        className={labelClasses}
        onClick={e => this.onClick(e)}
      >
        <span className={`label-text label-text-${i18n.t('lang-float')}`}>
          {this.props.label}
        </span>

        {this.props.children}
      </div>
    );
  }

  // Optional if defined fires an onclick for that label
  onClick = event => {
    if (!this.props.onClick) return;
    this.props.onClick(this.props.label, event);
  };
}

Label.propTypes = {
  label: PropTypes.string,
  backgroundColor: PropTypes.string,
  onClick: PropTypes.func,
};

export default Label;
