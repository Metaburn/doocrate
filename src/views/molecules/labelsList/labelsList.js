import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-i18next';

import './labelsList.css';
import Label from 'src/views/atoms/label';

class LabelsList extends Component {
  constructor() {
    super(...arguments);
    this.state = {};
  }

  render() {
    if (!this.props.labels) {
      return null;
    }
    return (
      <I18n ns="translations">
        {(t, { i18n }) => (
          <div className={'labels-list-wrapper'}>
            <div className={`labels-list flex-${t('lang-float')}`}>
              {this.props.labels.map(label => {
                return (
                  <Label
                    key={label}
                    label={label}
                    backgroundColor={'#AAA'}
                    onClick={this.props.onLabelClick}
                  />
                );
              })}
            </div>
          </div>
        )}
      </I18n>
    );
  }
}

LabelsList.propTypes = {
  labels: PropTypes.array,
  onLabelClick: PropTypes.func,
};

export default LabelsList;
