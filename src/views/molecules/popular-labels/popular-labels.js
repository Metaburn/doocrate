import React, {Component} from 'react';
import PropTypes from "prop-types";
import { I18n } from 'react-i18next';

import './popular-labels.css';
import Label from "src/views/atoms/label";

class PopularLabels extends Component {

  constructor() {
    super(...arguments);
    this.state = {};
  }

  render() {
    return (
      <I18n ns='translations'>
        {
          (t, {i18n}) => (
            <div className={'popular-labels-wrapper'}>
              <div className={`popular-labels flex-${t('lang-float')}`}>
                {
                  this.props.labels.map(label => {
                    return (
                      <Label key={label}
                             label={label}
                             backgroundColor={'#AAA'}
                             onClick={this.props.onLabelClick}/>
                    )
                  })
                }
              </div>
            </div>
          )}
      </I18n>
    );
  }
}

PopularLabels.propTypes = {
  labels: PropTypes.array,
  onLabelClick: PropTypes.func,
};

export default PopularLabels;
