import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {withRouter} from "react-router-dom"
import { I18n } from 'react-i18next';

import BottomNavTile from "./bottom-nav-bar-tile"
import {nav} from "./_nav"
import "./bottom-nav-bar.scss"

class BottomNavBar extends Component {

  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  activeRoute = (routeName)  =>{
    return this.props.location.pathname === routeName;
  };

  render() {
    const {auth} = this.props;
    const routes = nav(auth);

    return (
      <I18n ns='translations'>
        {
          (t, {i18n}) => (
            <div className={"bottom-nav"}>
                {routes.map(r => (<BottomNavTile key={r.path} icon={r.icon} path={r.path} active={this.activeRoute(r.path)}/>))}
            </div>
          )
        }
      </I18n>
    );
  }
}

export default withRouter(BottomNavBar);
