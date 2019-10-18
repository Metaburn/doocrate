import React, {Component} from 'react';
import TaskFilters from '../../components/task-filters';

import './filter-menu.css';
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import {authActions} from "../../../auth";
import {connect} from "react-redux";
import {userInterfaceActions} from "../../../user-interface";
import {buildFilter, taskFilters, tasksActions} from "../../../tasks";
import {labelActions} from "../../../labels";
import {notificationActions} from "../../../notification";
import {commentsActions} from "../../../comments";
import { I18n } from 'react-i18next';
import i18n from "../../../i18n";
import {addQueryParam} from "../../../utils/browser-utils";

class FilterMenu extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      menuIsOpen: false,
    }
  }

  render() {
    return (
      <I18n ns='translations'>
        {
          (t) => (
            <div className={'filter-menu'}>
              <h1 className={`title title-${t('lang-float')}`}>{t('filter.header')}</h1>
              {<TaskFilters
                selectedProject={this.props.selectedProject} //TODO does this work with this.state.selectedProject
                labelsPool={this.props.labelsPool || []}
                onLabelChange={this.onLabelChanged}
                query={this.state.query}
                generateCSV={this.generateCSV.bind(this)}
                userDefaultProject={this.props.auth.defaultProject}
                isAdmin={this.isAdmin()}/>
              }
            </div>
          )
        }
      </I18n>
    )
  }

  // Check if admin of that project
  isAdmin = () => {
    const projectUrl = (this.props.selectedProject? this.props.selectedProject.projectUrl : null);
    return this.props.auth.role === 'admin' &&
      this.props.auth.adminProjects.includes(projectUrl);
  };

  // TODO - Get this code out of here
  generateCSV = () => {
    console.log("Generating csv...");
    if (!this.isAdmin()) return;

    const csv = [["TaskId", "Task Name", "Type", "CreatorId", "Creator Name" , "AssigneeId", "Assignee Name", "Assignee email", "Labels"]];

    this.state.tasks.forEach((t) => {

      const defaultTypes = [
        i18n.t('task.types.planning'),
        i18n.t('task.types.shifts'),
        i18n.t('task.types.camps'),
        i18n.t('task.types.art'),
        i18n.t('task.types.other')
      ];


      const taskTypeString = t.type? defaultTypes[t.type - 1] : 'None';
      let tcsv = [t.id, t.title, taskTypeString, t.creator.id, t.creator.name];

      let labels = [];
      Object.keys(t.label).forEach((label) => {
        labels.push(label);
      });


      if (t.assignee != null) {
        tcsv = tcsv.concat([t.assignee.id, t.assignee.name, t.assignee.email, labels]);
      }
      csv.push(tcsv);

    });

    return csv;
  };

  onLabelChanged = (label) => {
    this.props.history.push({
      search: addQueryParam('labels=' + label)
    });
  }
}

FilterMenu.propTypes = {
  unloadTasks: PropTypes.func.isRequired,
  unloadComments: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  setMenuOpen: PropTypes.func.isRequired,
  labelsPool: PropTypes.object,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    tasks: state.tasks.list,
    auth: state.auth,
    selectedProject: state.projects.selectedProject,
    labelsPool: state.tasks.labelsPool,
    labels: (state.projects.selectedProject && state.projects.selectedProject.popularTags) ? Object.keys(state.projects.selectedProject.popularTags) : null,
    filters: taskFilters,
    buildFilter: buildFilter
  }
};

const mapDispatchToProps = Object.assign(
  {},
  tasksActions,
  commentsActions,
  notificationActions,
  labelActions,
  authActions,
  userInterfaceActions
);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FilterMenu));
