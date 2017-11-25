import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import TagsInput from 'react-tagsinput';
import { getUrlSearchParams } from 'src/utils/browser-utils.js';
import { Redirect } from 'react-router';
import Autosuggest from 'react-autosuggest';
import AutoSuggestedTags from '../auto-suggested-tags';
import {CSVLink, CSVDownload} from 'react-csv';
import { I18n } from 'react-i18next';
import './task-filters.css';

class TaskFilters extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      label: [],
      CSVLink: undefined
    };

    this.handleLabelChange = this.handleLabelChange.bind(this);
  }
  static propTypes = {
    onLabelChange: PropTypes.func.isRequired,
    labels: PropTypes.object.isRequired,
    generateCSV:  PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
  }

  // Since react router doesn't support query we read it manually from the url
  getFilterQuery(location) {
    const params = getUrlSearchParams();
    return params['filter'];
  }

  getFilterText(location) {
    const params = getUrlSearchParams();
    return params['text'];
  }

  onCSVLink() {
    console.log("inCSV");
    let csvLink = undefined;

    this.setState({CSVLink: <li><CSVLink data={this.props.generateCSV()}>Download CSV</CSVLink></li>});
  }

  render() {
    const showPlaceholder = !this.state.label || this.state.label.length == 0 ;
    const { filter } = this.props;


    let downloadCSV = null;
    if (this.props.isAdmin) {
      downloadCSV = this.state.CSVLink ?  this.state.CSVLink : <li onClick={this.onCSVLink.bind(this)}>Make CSV</li>;
    }

    return(
      <I18n ns='translations'>
      {
      (t, { i18n }) => (
        <div className="task-filters">
        <ul className='main-filters'>

          <li><NavLink isActive={(match, location) => {
            return(
            this.getFilterQuery(location) === 'taskType' &&
            this.getFilterText(location) === '2')
          }} to={{ pathname: '/', search: 'filter=taskType&text=2'}}>{t('task.types.shifts')}</NavLink></li>

          <li><NavLink isActive={(match, location) => {
            return (this.getFilterQuery(location) === 'taskType' &&
            this.getFilterText(location) === '1')
          }} to={{ pathname: '/', search: 'filter=taskType&text=1'}}>{t('task.types.planning')}</NavLink></li>

          <li><NavLink isActive={(match, location) => {
            return(
            this.getFilterQuery(location) === 'taskType' &&
            this.getFilterText(location) === '3'
            )
          }} to={{ pathname: '/', search: 'filter=taskType&text=3'}}>{t('task.types.camps')}</NavLink></li>

          <li><NavLink isActive={(match, location) => {
            return(
            this.getFilterQuery(location) === 'taskType' &&
            this.getFilterText(location) === '4'
            )
          }} to={{ pathname: '/', search: 'filter=taskType&text=4'}}>{t('task.types.art')}</NavLink></li>

          <li><NavLink isActive={(match, location) => this.getFilterQuery(location) === 'mine'} to={{ pathname: '/', search: 'filter=mine'}}>{t('task.my-tasks')}</NavLink></li>
          <li><NavLink isActive={(match, location) => this.getFilterQuery(location) === 'unassigned'} to={{ pathname: '/', search: 'filter=unassigned'}}>{t('task.free-tasks')}</NavLink></li>
          <li><NavLink isActive={(match, location) => this.getFilterQuery(location) === undefined} to='/'>{t('task.all-tasks')}</NavLink></li>
          {downloadCSV}
          <li>

          <AutoSuggestedTags
            value = {this.state.label}
            labels = { this.props.labels}
            placeholder = {t('task.search-by-tags')}
            onChange = {this.handleLabelChange} />
        </li>

        </ul>
        </div>
      )}
      </I18n>
    );
  }

  handleLabelChange(label) {
    this.setState({label, redirect: true});
    this.props.onLabelChange(label);
  }
}

TaskFilters.propTypes = {
  filter: PropTypes.object
};

export default TaskFilters;
