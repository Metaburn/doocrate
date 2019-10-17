import React from 'react';
import PropTypes from 'prop-types';
import Icon from "src/views/components/icon";

import './label.css';

class Label extends React.Component {
  render() {
    const backgroundColor  = this.props.backgroundColor || '#999';
    return (
      <div key={this.props.label} style={{'backgroundColor': `${backgroundColor}` }} className='label-wrapper'>
        <span className={'label-text'}>
          {this.props.label}
        </span>
        {this.props.onClear && this.renderCloseBtn() }
      </div>
    );
  }

  renderCloseBtn = () => {
    return (
      <button className={'close-button'} onClick={this.props.onClear}>
        <Icon name={'close'} alt={'Clear'} onClick={this.props.onClear}/>
      </button>
    )
  };
}

Label.propTypes = {
  onClear: PropTypes.func,
  label: PropTypes.string,
  backgroundColor: PropTypes.string,
};

export default Label;
