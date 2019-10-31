import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import ToolTip from 'react-portal-tooltip';
import Icon from '../../atoms/icon';
import { setQueryParams, removeQueryParam} from 'src/utils/browser-utils.js';

import { I18n } from 'react-i18next';

import './complete-filter.css';
import TaskFilters from "../task-filters/task-filters";

class CompleteFilter extends Component {
  constructor() {
    super(...arguments);
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
  }

  state = {
    isTooltipActive: false
  };

  showTooltip() {
    this.setState({isTooltipActive: true})
  }

  hideTooltip() {
    this.setState({isTooltipActive: false});
  }

  render() {
    return (
      <I18n ns='translations'>
        {
          (t) => (
            <div className={`complete-filter complete-filter-${t('lang-float-reverse')} float-dir-${t('lang-float-reverse')}`}
                 onMouseEnter={this.showTooltip}
                 onMouseLeave={this.hideTooltip}>
              <Icon className='label notranslate' name='filter_list' />

              <ToolTip active={this.state.isTooltipActive} position='bottom' arrow='left' parent='.complete-filter'>
                <span className='complete-tooltip-container'>

                  <span>
                    <NavLink isActive={(match, location) => {
                      return(
                        TaskFilters.getCompleteQuery(location) === 'false'
                      )
                    }} to={{ pathname: '/'+ this.props.projectUrl + '/task/1',
                      search: setQueryParams(['complete=false'])}}>{t('task.incomplete-tasks')}</NavLink>
                  </span>

                  <span>
                    <NavLink isActive={(match, location) => {
                      return(
                        TaskFilters.getCompleteQuery(location) === 'true'
                      )
                    }} to={{ pathname: '/'+ this.props.projectUrl + '/task/1',
                      search: setQueryParams(['complete=true'])}}>{t('task.complete-tasks')}</NavLink>
                  </span>

                  <span>
                    <NavLink isActive={(match, location) => {
                      return(
                        TaskFilters.getCompleteQuery(location) === undefined
                      )
                    }} to={{ pathname: '/'+ this.props.projectUrl + '/task/1',
                      search: removeQueryParam(['complete'])}}>{t('task.all-the-tasks')}</NavLink>
                  </span>

                </span>
              </ToolTip>
            </div>
          )}
      </I18n>
    )
  }
}

CompleteFilter.propTypes = {
  projectUrl: PropTypes.string.isRequired,
};

export default CompleteFilter;
