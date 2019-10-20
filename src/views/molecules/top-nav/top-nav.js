import React, {Component} from 'react';
import PropTypes from "prop-types";
import { I18n } from 'react-i18next';

import './top-nav.css';
import Button from "../../components/button/button";
import SearchBar from "../search-bar/search-bar";
import SelectedFiltersLabels from "../selected-filters-labels/selected-filters-labels";
import Icon from "../../components/icon/icon";

class TopNav extends Component {

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
            <div className={'top-nav'}>
              <Button
                className='button button-small add-task-button'
                onClick={this.props.createTask}>
                <Icon name={'add'} className={`add-task-icon add-task-icon-${t('lang-float')}`}/>
                {t(`task.add-task`)}
              </Button>
              <SearchBar
                query={this.props.query}
                onQueryChange={this.props.onQueryChange}
                setMenuOpen={this.props.setMenuOpen}
                isFilterActive={ this.props.isFilterActive}
              />
              <SelectedFiltersLabels
                selectedFilters={ this.props.selectedFilters }
                onClearFilter={this.props.removeQueryByLabel} />
            </div>
          )}
      </I18n>
    );
  }
}

TopNav.propTypes = {
  query: PropTypes.string,
  onQueryChange: PropTypes.func,
  setMenuOpen: PropTypes.func,
  removeQueryByLabel: PropTypes.func,
  selectedFilters: PropTypes.string,
  isFilterActive: PropTypes.bool,
  createTask: PropTypes.func
};

export default TopNav;
