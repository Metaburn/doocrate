import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { getUrlSearchParams, addQueryParam, removeQueryParam} from 'src/utils/browser-utils.js';
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
    this.getTaskTypeFromProject = this.getTaskTypeFromProject.bind(this);
  }

  // Since react router doesn't support query we read it manually from the url
  static getFilterQuery() {
    const params = getUrlSearchParams();
    return params['filter'];
  }

  static getCompleteQuery() {
    const params = getUrlSearchParams();
    return params['complete'];
  }

  static getFilterText() {
    const params = getUrlSearchParams();
    return params['text'];
  }

  onCSVLink() {
    console.log("inCSV");

    this.setState({CSVLink: <li><CSVLink data={this.props.generateCSV()}>Download CSV</CSVLink></li>});
  }

  getTaskTypeFromProject(index) {
    if (!this.props.selectedProject ||
      !this.props.selectedProject.taskTypes ||
      this.props.selectedProject.taskTypes.length <= 0 ||
      this.props.selectedProject.taskTypes.length <= index
    ) {
      return ''; //TODO - should look better like a placeholder
    }else {
      return this.props.selectedProject.taskTypes[index];
    }
  }

  render() {
    let downloadCSV = null;
    if (this.props.isAdmin) {
      downloadCSV = this.state.CSVLink ?  this.state.CSVLink : <li onClick={this.onCSVLink.bind(this)}>Make CSV</li>;
    }
    const project = (this.props.selectedProject && this.props.selectedProject.url !== 'undefined')?
      this.props.selectedProject.url : this.props.userDefaultProject;

    const defaultTask = '/' + project + '/task/1';

    return(
      <I18n ns='translations'>
      {
      (t) => (
        <div className="task-filters">
        <ul className='main-filters'>
          <div className={'categories'}>
            <h1 className={`filter-heading filter-heading-${t('lang-float')}`}>{t('filter.category')}</h1>

            <li><NavLink isActive={(match, location) => {
              return(
                TaskFilters.getFilterQuery(location) === 'taskType' &&
                TaskFilters.getFilterText(location) === '1')
            }} to={{ pathname: defaultTask,
              search: addQueryParam('filter=taskType&text=1')}}>{this.getTaskTypeFromProject(0)}</NavLink></li>

            <li><NavLink isActive={(match, location) => {
              return (TaskFilters.getFilterQuery(location) === 'taskType' &&
                TaskFilters.getFilterText(location) === '2')
            }} to={{ pathname: defaultTask,
              search: addQueryParam('filter=taskType&text=2')}}>{this.getTaskTypeFromProject(1)}</NavLink></li>

            <li><NavLink isActive={(match, location) => {
              return(
                TaskFilters.getFilterQuery(location) === 'taskType' &&
              TaskFilters.getFilterText(location) === '3'
              )
            }} to={{ pathname: defaultTask,
              search: addQueryParam('filter=taskType&text=3')}}>{this.getTaskTypeFromProject(2)}</NavLink></li>

            <li><NavLink isActive={(match, location) => {
              return(
                TaskFilters.getFilterQuery(location) === 'taskType' &&
                TaskFilters.getFilterText(location) === '4'
              )
            }} to={{ pathname: defaultTask,
              search: addQueryParam('filter=taskType&text=4')}}>{this.getTaskTypeFromProject(3)}</NavLink></li>

            <li><NavLink isActive={(match, location) => {
              return(
                TaskFilters.getFilterQuery(location) === 'taskType' &&
                TaskFilters.getFilterText(location) === '5'
              )
            }} to={{ pathname: defaultTask,
              search: addQueryParam('filter=taskType&text=5')}}>{this.getTaskTypeFromProject(4)}</NavLink></li>
            </div>

          <h1 className={`filter-heading filter-heading-${t('lang-float')}`}>{t('filter.task-type')}</h1>
          <div className={'task-type'}>
            <li><NavLink isActive={(match, location) => TaskFilters.getFilterQuery(location) === 'mine'} to={{ pathname: defaultTask,
              search: addQueryParam('filter=mine')}}>
              {t('task.my-tasks')}
              </NavLink></li>
            <li><NavLink isActive={(match, location) => TaskFilters.getFilterQuery(location) === 'unassigned'} to={{ pathname: defaultTask,
              search: addQueryParam('filter=unassigned')}}>
              {t('task.free-tasks')}
              </NavLink></li>
            <li><NavLink isActive={(match, location) => TaskFilters.getFilterQuery(location) === undefined} to={{
              pathname: defaultTask,
              search: removeQueryParam(['filter'])
            }}>{t('task.all-tasks')}</NavLink></li>
          </div>

          {downloadCSV}

          <h1 className={`filter-heading filter-heading-${t('lang-float')}`}>{t('filter.by-tag')}</h1>
          <li>
            <AutoSuggestedTags
              value={this.state.label}
              labels={this.props.labels}
              placeholder={t('task.search-by-tags')}
              onChange={this.handleLabelChange}/>
          </li>

        </ul>
        </div>
      )}
      </I18n>
    );
  }

  handleLabelChange(label) {
    this.setState({label});
    this.props.onLabelChange(label);
  }
}

TaskFilters.propTypes = {
  onLabelChange: PropTypes.func.isRequired,
  selectedProject: PropTypes.object,
  labels: PropTypes.object.isRequired,
  generateCSV: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  userDefaultProject: PropTypes.string,
  query: PropTypes.string.isRequired
};


export default TaskFilters;
