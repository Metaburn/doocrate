import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';

import { I18n } from 'react-i18next';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import { notificationActions } from "../../../notification";
import {createSelector} from "reselect";
import {authActions, getAuth} from "../../../auth";
import { updateUserData } from "src/auth/auth";
import MyPortfolio from "../../molecules/myPortfolio/myPortfolio";

import './me.css';

export class Me extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const auth = this.props.auth;

    return (
      <I18n ns='translations'>
        {
          (t, {i18n}) => (
            <div className='me notranslate'>
              <MyPortfolio
                auth={this.props.auth}
                showSuccess={this.props.showSuccess}
                isShowUpdateProfile={this.props.isShowUpdateProfile}
                updateUserData={(userData) => this.updateUserData(i18n, userData)}
                i18n={i18n}/>

              {auth && auth.role !== 'user' ?
                <div className={'projects-you-manage'}>{t('my-space.projects-you-manage')}:</div>
                :
                ''
              }
              { this.renderAdminProjects(t)}
            </div>
          )}
      </I18n>
    )
  }

  updateUserData = (i18n, newData) => {
    updateUserData(newData).then( () => {
      this.props.showSuccess(i18n.t('my-space.updated-successfully'));
      this.props.history.goBack();
    })
  };

  renderAdminProjects = (t) => {
    const { auth } = this.props;

    if (!auth || !auth.adminProjects || auth.adminProjects.size <= 0)
      return;

    return (
      <div className={'projects'}>
        {
          auth.adminProjects.map(project => {
            return (
              <div className={'project'} key={project}>
                <span>{project}</span>
                <span><NavLink to={`/${project}/reports`}>{t('my-space.project-report')}</NavLink></span>
                <span><NavLink to={`/${project}/edit`}>{t('my-space.edit-project')}</NavLink></span>
              </div>
            )
          })
        }
      </div>
    )
  }
}

Me.propTypes = {
  auth: PropTypes.object.isRequired,
  showSuccess: PropTypes.func.isRequired,
  isShowUpdateProfile: PropTypes.func.isRequired
};


//=====================================
//  CONNECT
//-------------------------------------
const mapStateToProps = createSelector(
  getAuth,
  (auth) => ({
    auth
  })
);


const mapDispatchToProps = Object.assign(
  {},
  notificationActions,
  authActions
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Me);
