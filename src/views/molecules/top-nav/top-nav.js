import React, {Component} from 'react';
import PropTypes from "prop-types";
import { I18n } from 'react-i18next';

import './top-nav.css';
import Button from "../../components/button/button";
import SearchBar from "../search-bar/search-bar";
import SelectedFiltersLabels from "../selected-filters-labels/selected-filters-labels";
import Icon from "../../atoms/icon/icon";

class TopNav extends Component {

  componentWillReceiveProps(nextProps, nextContext) {
    // console.log(nextProps, '*** ')
  }

  render() {
    console.log( ' render TopNav *** ', this.props)
    return (
      <I18n ns='translations'>
        {
          (t, {i18n}) => (
            <div className={'top-nav'} data-tour={"two"}>
              <Button
                className='button button-small add-task-button'
                onClick={this.props.createTask}
                dataTour={"one"}
              >
                <Icon name={'add'} className={`add-task-icon add-task-icon-${t('lang-float')}`}
                      />
              </Button>
              <SearchBar
                query={this.props.query}
                onQueryChange={this.props.onQueryChange}
                setMenuOpen={this.props.setMenuOpen}
                isFilterActive={ this.props.isFilterActive}
                title={this.props.title}
                tasksCount={this.props.tasksCount}
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
  title: PropTypes.string,
  tasksCount: PropTypes.number,
  onQueryChange: PropTypes.func,
  setMenuOpen: PropTypes.func,
  removeQueryByLabel: PropTypes.func,
  selectedFilters: PropTypes.array,
  isFilterActive: PropTypes.bool,
  createTask: PropTypes.func
};

export default TopNav;
