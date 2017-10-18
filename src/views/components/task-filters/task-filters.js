import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import TagsInput from 'react-tagsinput';
import { getUrlSearchParams } from 'src/utils/browser-utils.js';
import { Redirect } from 'react-router';
import Autosuggest from 'react-autosuggest';
import AutoSuggestedTags from '../auto-suggested-tags';
import './task-filters.css';

class TaskFilters extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      label: []
    };
    
    this.handleLabelChange = this.handleLabelChange.bind(this);
  }
  static propTypes = {
    onLabelChange: PropTypes.func.isRequired,
    labels: PropTypes.object.isRequired
  }

  // Since react router doesn't support query we read it manually from the url
  getFilterQuery(location) {
    const params = getUrlSearchParams();
    return params['filter'];
  }

  render() {
    const showPlaceholder = !this.state.label || this.state.label.length == 0 ;
    const { filter } = this.props;
    return(
      <div className="task-filters">
      <ul>
        <li><NavLink isActive={(match, location) => this.getFilterQuery(location) === undefined} to='/'>כל המשימות בעולם</NavLink></li>
        <li><NavLink isActive={(match, location) => this.getFilterQuery(location) === 'mine'} to={{ pathname: '/', search: 'filter=mine'}}>המשימות שלי</NavLink></li>
        <li><NavLink isActive={(match, location) => this.getFilterQuery(location) === 'unassigned'} to={{ pathname: '/', search: 'filter=unassigned'}}>משימות פנויות</NavLink></li>
        <li><NavLink isActive={(match, location) => this.getFilterQuery(location) === 'label'} to={{ pathname: '/', search: 'filter=label'}}>משימות לפי תגית</NavLink></li>
        <li>

        <AutoSuggestedTags
          value = {this.state.label}
          labels = { this.props.labels}
          placeholder = 'חפשי משימה לפי תגיות'
          onChange = {this.handleLabelChange} />
      </li>
      </ul>
      </div>
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
