import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TaskFilters from '../../components/task-filters';
import { withRouter } from 'react-router-dom';
import { authActions } from '../../../auth';
import { connect } from 'react-redux';
import { userInterfaceActions } from '../../../user-interface';
import { buildFilter, taskFilters, tasksActions } from '../../../tasks';
import { labelActions } from '../../../labels';
import { notificationActions } from '../../../notification';
import { commentsActions } from '../../../comments';
import i18n from '../../../i18n';
import { setQueryParams } from '../../../utils/browser-utils';
import './filter-menu.css';

class FilterMenu extends Component {
  render() {
    const { selectedProject, labelsPool, auth, popularLabels } = this.props;
    const classNames = `filter-menu lang-${i18n.language}`;

    return (
      <div className={classNames}>
        <h1 className="menu-title">{i18n.t('filter.header')}</h1>
        <TaskFilters
          selectedProject={selectedProject} //TODO does this work with this.state.selectedProject
          labelsPool={labelsPool || []}
          onLabelChange={this.onLabelChanged}
          generateCSV={this.generateCSV}
          userDefaultProject={auth.defaultProject}
          isAdmin={this.isAdmin()}
          popularLabels={popularLabels}
          onApply={this.onApply}
        />
      </div>
    );
  }

  onApply = () => {
    this.props.setMenuOpen(false);
  };

  // Check if admin of that project
  isAdmin = () => {
    const { auth, selectedProject } = this.props;
    const projectUrl = selectedProject ? selectedProject.url : null;
    return auth.role === 'admin' && auth.adminProjects.includes(projectUrl);
  };

  // TODO - Get this code out of here
  generateCSV = () => {
    if (!this.isAdmin()) return;

    const { tasks, selectedProject } = this.props;
    const csv = [
      [
        'TaskId',
        'Task Name',
        'Type',
        'Created',
        'Description',
        'CreatorId',
        'Creator Name',
        'AssigneeId',
        'Assignee Name',
        'Assignee email',
        'Labels',
      ],
    ];

    tasks.forEach(t => {
      const taskTypes = selectedProject.taskTypes;
      const taskTypeString = t.type ? taskTypes[t.type - 1] : 'None';
      let tcsv = [
        t.id,
        t.title,
        taskTypeString,
        t.created,
        t.description,
        t.creator.id,
        t.creator.name,
      ];

      let labels = [];
      Object.keys(t.label).forEach(label => {
        labels.push(label);
      });

      if (t.assignee != null) {
        tcsv = tcsv.concat([
          t.assignee.id,
          t.assignee.name,
          t.assignee.email,
          labels,
        ]);
      }

      tcsv = tcsv.concat([labels]);

      csv.push(tcsv);
    });

    return csv;
  };

  onLabelChanged = label => {
    this.props.history.push({
      search: setQueryParams(['labels=' + label]),
    });
  };
}

FilterMenu.propTypes = {
  unloadTasks: PropTypes.func.isRequired,
  unloadComments: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  setMenuOpen: PropTypes.func.isRequired,
  labelsPool: PropTypes.object,
  popularLabels: PropTypes.array,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    tasks: state.tasks.list,
    auth: state.auth,
    selectedProject: state.projects.selectedProject,
    labelsPool: state.tasks.labelsPool,
    popularLabels:
      state.projects.selectedProject &&
      state.projects.selectedProject.popularTags
        ? Object.keys(state.projects.selectedProject.popularTags)
        : null,
    filters: taskFilters,
    buildFilter: buildFilter,
  };
};

const mapDispatchToProps = Object.assign(
  {},
  tasksActions,
  commentsActions,
  notificationActions,
  labelActions,
  authActions,
  userInterfaceActions,
);

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(FilterMenu),
);
