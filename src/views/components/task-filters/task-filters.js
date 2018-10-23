import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { getUrlSearchParams } from 'src/utils/browser-utils.js';
import AutoSuggestedTags from '../auto-suggested-tags';
import {CSVLink} from 'react-csv';
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
    projectUrl: PropTypes.object.isRequired,
    labels: PropTypes.object.isRequired,
    generateCSV:  PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
  };

  // Since react router doesn't support query we read it manually from the url
  static getFilterQuery() {
    const params = getUrlSearchParams();
    return params['filter'];
  }

  static getFilterText() {
    const params = getUrlSearchParams();
    return params['text'];
  }

  onCSVLink() {
    console.log("inCSV");

    this.setState({CSVLink: <li><CSVLink data={this.props.generateCSV()}>Download CSV</CSVLink></li>});
  }

  render() {
    let downloadCSV = null;
    if (this.props.isAdmin) {
      downloadCSV = this.state.CSVLink ?  this.state.CSVLink : <li onClick={this.onCSVLink.bind(this)}>Make CSV</li>;
    }

    return(
      <I18n ns='translations'>
      {
      (t, {  }) => (
        <div className="task-filters">
        <ul className='main-filters'>

          <li><NavLink isActive={(match, location) => {
            return(
              TaskFilters.getFilterQuery(location) === 'taskType' &&
              TaskFilters.getFilterText(location) === '2')
          }} to={{ pathname: '/' + this.props.projectUrl, search: 'filter=taskType&text=2'}}>{t('task.types.shifts')}</NavLink></li>

          <li><NavLink isActive={(match, location) => {
            return (TaskFilters.getFilterQuery(location) === 'taskType' &&
              TaskFilters.getFilterText(location) === '1')
          }} to={{ pathname: '/'+ this.props.projectUrl, search: 'filter=taskType&text=1'}}>{t('task.types.planning')}</NavLink></li>

          <li><NavLink isActive={(match, location) => {
            return(
              TaskFilters.getFilterQuery(location) === 'taskType' &&
            TaskFilters.getFilterText(location) === '3'
            )
          }} to={{ pathname: '/'+ this.props.projectUrl, search: 'filter=taskType&text=3'}}>{t('task.types.camps')}</NavLink></li>

          <li><NavLink isActive={(match, location) => {
            return(
              TaskFilters.getFilterQuery(location) === 'taskType' &&
              TaskFilters.getFilterText(location) === '4'
            )
          }} to={{ pathname: '/'+ this.props.projectUrl, search: 'filter=taskType&text=4'}}>{t('task.types.art')}</NavLink></li>

          <li><NavLink isActive={(match, location) => TaskFilters.getFilterQuery(location) === 'mine'} to={{ pathname: '/'+ this.props.projectUrl, search: 'filter=mine'}}>{t('task.my-tasks')}</NavLink></li>
          <li><NavLink isActive={(match, location) => TaskFilters.getFilterQuery(location) === 'unassigned'} to={{ pathname: '/'+ this.props.projectUrl, search: 'filter=unassigned'}}>{t('task.free-tasks')}</NavLink></li>
          <li><NavLink isActive={(match, location) => TaskFilters.getFilterQuery(location) === undefined} to={'/'+ this.props.projectUrl }>{t('task.all-tasks')}</NavLink></li>
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
