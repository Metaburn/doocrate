import React, {Component, Fragment} from 'react';
import PropTypes from "prop-types";
import { I18n } from 'react-i18next';

import './selected-filters-labels.css';
import Label from "src/views/atoms/label";

class SelectedFiltersLabels extends Component {

  constructor() {
    super(...arguments);
    this.state = {};
  }

  render() {
    return (
      <I18n ns='translations'>
        {
          (t, {i18n}) => (
            <div className={'selected-filters-labels-wrapper'}>
              <div className={`flex-${t('lang-float')}`}>
                {
                  this.props.selectedFilters.map(filter => {
                    return (
                      <Label key={filter}
                             label={filter}
                             backgroundColor={'#eb1478'}
                             onClear={this.props.onClearFilter}/>
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

SelectedFiltersLabels.propTypes = {
  selectedFilters: PropTypes.array,
  onClearFilter: PropTypes.func,
};

export default SelectedFiltersLabels;
