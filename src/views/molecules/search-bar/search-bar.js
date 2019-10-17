import React, {Component, Fragment} from 'react';
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
            <div className={'search-bar'}>
              <Icon className={'search-icon'} name={'search'}/>

              <input
                className={"search-input"}
                placeholder={t('task.search-by-query')}
                type={"text"}
                value={this.props.query}
                onChange={(e) => {
                  this.props.onQueryChange(e.target.value)
                }}/>

              <FilterIcon onClick={() => {
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
  setMenuOpen: PropTypes.func
};

export default SearchBar;
