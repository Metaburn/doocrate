import React, {Component, Fragment} from 'react';
import TaskFilters from '../../components/task-filters';

import './filter-menu.css';
import PropTypes from "prop-types";
import {createSelector} from "reselect";
import {authActions, getAuth} from "../../../auth";
import {connect} from "react-redux";
import {userInterfaceActions} from "../../../user-interface";
import {buildFilter, taskFilters, tasksActions} from "../../../tasks";
import {labelActions} from "../../../labels";
import {notificationActions} from "../../../notification";
import {commentsActions} from "../../../comments";
import { I18n } from 'react-i18next';
import i18n from "../../../i18n";

class FilterMenu extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      menuIsOpen: false
    }
  }

  render() {
    return (
      <I18n ns='translations'>
        {
          (t) => (
            <div className={'filter-menu'}>
              <hr/>
              <h1 className={`title title-${t('lang-float')}`}>FILTERS</h1>
              <hr/>
              {<TaskFilters
                selectedProject={this.props.selectedProject} //TODO does this work with this.state.selectedProject

                labels={['Label1', 'Label2']} //{this.state.labelPool} //TODO - this should be collected on some task selector

                onLabelChange={this.onLabelChanged}
                onQueryChange={this.onQueryChange}
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
    const projectUrl = this.props.selectedProject.projectUrl;
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
}

FilterMenu.propTypes = {
  unloadTasks: PropTypes.func.isRequired,
  unloadComments: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  setMenuOpen: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    tasks: state.tasks.list,
    auth: state.auth,
    selectedProject: state.projects.selectedProject,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterMenu);
