import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from 'src/i18n';

import './emptyPlaceholder.css';

class EmptyPlaceholder extends Component {
  render() {
    return (
      <div className="empty-placeholder">
        <h3>
          {i18n.t('task.no-tasks-found')}
          <div>
            <button
              className={`click-here-${i18n.t('lang-float')}`}
              onClick={this.props.onClearFilters}
            >
              {i18n.t('task.click-here')}
            </button>
            {i18n.t('task.no-tasks-placeholder2')}
          </div>
        </h3>
      </div>
    );
  }
}

EmptyPlaceholder.propTypes = {
  onClearFilters: PropTypes.func.isRequired,
};

export default EmptyPlaceholder;
