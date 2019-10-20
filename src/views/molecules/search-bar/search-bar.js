import React, {Component} from 'react';
import PropTypes from "prop-types";
import { I18n } from 'react-i18next';
import Icon from '../../components/icon';
import FilterIcon from "src/views/atoms/filter-icon";

import './search-bar.css';

class SearchBar extends Component {

  constructor() {
    super(...arguments);
    this.state = {
    };
  }

  render() {
    return (
      <I18n ns='translations'>
        {
          (t, {i18n}) => (
            <div className={`search-bar`}>
              <div className={'search-container'}>
                <input
                  className={"search-input"}
                  placeholder={t('task.search-by-query')}
                  type={"text"}
                  value={this.props.query}
                  onChange={(e) => {
                    this.props.onQueryChange(e.target.value)
                  }}/>
                <Icon className={'search-icon'} name={'search'}/>
              </div>

              <FilterIcon isActive={this.props.isFilterActive} onClick={() => {
                this.props.setMenuOpen(true)
              }}/>
            </div>
          )}
      </I18n>
    );
  }
}

SearchBar.propTypes = {
  query: PropTypes.string,
  onQueryChange: PropTypes.func,
  setMenuOpen: PropTypes.func,
  isFilterActive: PropTypes.bool
};

export default SearchBar;
