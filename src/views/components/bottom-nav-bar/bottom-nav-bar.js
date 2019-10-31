import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {withRouter} from "react-router-dom"

import BottomNavTile from "./bottom-nav-bar-tile"
import {nav} from "./_nav"
import "./bottom-nav-bar.scss"


class BottomNavBar extends Component {

  static propTypes = {
    auth: PropTypes.object.isRequired,
    selectedProject: PropTypes.object,
  };

  activeRoute = (routeName, pathIncludes)  =>{
    if(pathIncludes) {
      return this.props.location.pathname.includes(pathIncludes);
    }else{
      return this.props.location.pathname === routeName;
    }
  };

  render() {
    const {auth, selectedProject, location} = this.props;

    // Hide on sign in page
    if (location.pathname.match("/sign-in/")){
      return null;
    }

    const projectUrl = (selectedProject &&
      selectedProject.url &&
      selectedProject.url !== 'undefined')?
      selectedProject.url : auth.defaultProject;

    const routes = nav(auth, projectUrl);

    return (
      <div className={"bottom-nav"}>
          {routes.map(r => (<BottomNavTile key={r.path} icon={r.icon} path={r.path} active={this.activeRoute(r.path, r.pathIncludes)}/>))}
      </div>
    )
  }
}

export default withRouter(BottomNavBar);
