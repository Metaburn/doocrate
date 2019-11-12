import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { getUrlSearchParams, removeQueryParam} from 'src/utils/browser-utils.js';
import AutoSuggestedTags from '../auto-suggested-tags';
import {CSVLink} from 'react-csv';
import i18n from '../../../i18n';
import { setQueryParams } from '../../../utils/browser-utils';
import LabelsList from '../../molecules/labelsList/labelsList';
import './task-filters.css';
import { uniq } from 'lodash';

class TaskFilters extends Component {
  constructor(props) {
    super(props);

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
    this.setState({CSVLink: <span><CSVLink className={'button-as-link'} data={this.props.generateCSV()}>Download Tasks as CSV (Admin)</CSVLink></span>});
  }

  getTaskTypeFromProject(index) {
    if (!this.props.selectedProject ||
      !this.props.selectedProject.taskTypes ||
      this.props.selectedProject.taskTypes.length <= 0 ||
      this.props.selectedProject.taskTypes.length <= index
    ) {
      return ''; //TODO - should look better like a placeholder
    } else {
      return this.props.selectedProject.taskTypes[index];
    }
  }

  // Labels is an array of ['label1','label2']
  // Tags is an object of {'label1':true,'label2':true}
  labelsPoolToTags = () => {
    const result = {};
    for (const label of this.props.labelsPool) {
      result[label] = true;
    }
    return result;
  };

  FilterLink = ({ id }) => {
    const project = (this.props.selectedProject && this.props.selectedProject.url !== 'undefined') ?
      this.props.selectedProject.url : this.props.userDefaultProject;
    const defaultTask = `/${project}/task/1`;
    const linkTitle = this.getTaskTypeFromProject(id);
    const search = setQueryParams([`filter=taskType&text=${id + 1}`]);

    const isActive = (match, location) =>
      TaskFilters.getFilterQuery(location) === 'taskType' &&
      TaskFilters.getFilterText(location) === (id + 1);

    return (
      <NavLink className={'filter-link'} isActive={isActive} to={{ pathname: defaultTask, search }}>
        {linkTitle}
      </NavLink>
    );
  };

  onPopularLabelClick = (label) => {
    this.handleLabelChange(uniq(this.state.label.concat([label])));
  };

  render() {
    let downloadCSV = null;

    if (this.props.isAdmin) {
      downloadCSV = this.state.CSVLink ? this.state.CSVLink : <button className={'button-as-link'} onClick={this.onCSVLink.bind(this)}>Prepare tasks as CSV (Admin)</button>;
    }

    const project = (this.props.selectedProject && this.props.selectedProject.url !== 'undefined') ?
      this.props.selectedProject.url : this.props.userDefaultProject;

    const defaultTask = '/' + project + '/task/1';

    return (
      <nav className="task-filters">
        <div className="categories">
          <div className="heading">{i18n.t('filter.category')}</div>
          {[0, 1, 2, 3, 4].map((id) => (<this.FilterLink key={id} id={id}/>))}
        </div>

        <div className="heading">{i18n.t('filter.task-type')}</div>
        <div className="task-type">
          <NavLink className={'filter-link'} isActive={(match, location) => TaskFilters.getFilterQuery(location) === 'mine'} to={{ pathname: defaultTask,
            search: setQueryParams(['filter=mine'])}}>
            {i18n.t('task.my-tasks')}
          </NavLink>

          <NavLink className={'filter-link'} isActive={(match, location) => TaskFilters.getFilterQuery(location) === 'unassigned'} to={{ pathname: defaultTask,
            search: setQueryParams(['filter=unassigned'])}}>
            {i18n.t('task.free-tasks')}
          </NavLink>

          <NavLink className={'filter-link'} isActive={(match, location) => TaskFilters.getFilterQuery(location) === undefined} to={{
            pathname: defaultTask,
            search: removeQueryParam(['filter']) }}>
            {i18n.t('task.all-tasks')}
          </NavLink>
        </div>

        <div className="heading">{i18n.t('filter.popular-tags')}</div>
        <LabelsList
          labels={this.props.popularLabels}
          onLabelClick={this.onPopularLabelClick}/>

        <div className="heading">{i18n.t('filter.by-tag')}</div>
        <AutoSuggestedTags
          value={this.state.label}
          labels={this.labelsPoolToTags()}
          placeholder={i18n.t('task.search-by-tags')}
          onChange={this.handleLabelChange}/>

        <button onClick={this.props.onApply} className={"apply-btn"}>{i18n.t("filter.apply")}</button>
        {downloadCSV}
      </nav>
    );
  }

  handleLabelChange(label) {
    this.setState({label});
    this.props.onLabelChange(label);
  }
}

TaskFilters.propTypes = {
  onLabelChange: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  selectedProject: PropTypes.object,
  popularLabels: PropTypes.array,
  labelsPool: PropTypes.object.isRequired,
  generateCSV: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  userDefaultProject: PropTypes.string,
};

export default TaskFilters;
