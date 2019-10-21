import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Icon from '../../components/icon';
import FilterIcon from 'src/views/atoms/filter-icon';
import i18n from '../../../i18n';
import './search-bar.css';

class SearchBar extends Component {
  render() {
    return (
      <div className={`search-bar lang-${i18n.language}`}>
        <div className={'search-container'}>
          <input
            className={"search-input"}
            placeholder={i18n.t('task.search-by-query')}
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
