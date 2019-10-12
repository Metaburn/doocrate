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
  static propTypes = {
    onLabelChange: PropTypes.func.isRequired,
    projectUrl: PropTypes.string.isRequired,
    selectedProject: PropTypes.object,
    labels: PropTypes.object.isRequired,
    generateCSV: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    userDefaultProject: PropTypes.string,
    filter: PropTypes.object,
    onQueryChange: PropTypes.func.isRequired,
    query: PropTypes.string.isRequired
  };

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
    const project = (this.props.projectUrl && this.props.projectUrl !== 'undefined')?
      this.props.projectUrl : this.props.userDefaultProject;

    const defaultTask = '/' + project + '/task/1';

    return(
      <I18n ns='translations'>
      {
      (t) => (
        <div className="task-filters">
        <ul className='main-filters'>

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
                {downloadCSV}

                <li>
                  <input
                    className={"search-input"}
                    placeholder={t('task.search-by-query')}
                    type={"text"}
                    value={this.props.query}
                    onChange={(e) => {
                      this.handleQueryChange(e.target.value)
                    }}/>
                </li>

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

  handleQueryChange = (query) => {
    this.props.onQueryChange(query);
  };
}


export default TaskFilters;
