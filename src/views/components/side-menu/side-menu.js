import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { slide as Menu } from 'react-burger-menu'

import './side-menu.css';
import FilterMenu from "../filter-menu/filter-menu";
import {userInterfaceActions} from "../../../user-interface";
import {createSelector} from "reselect";
import {getAuth} from "../../../auth";
import {connect} from "react-redux";
import Button from "../button/button";
import {getMenuIsOpen} from "../../../user-interface/selectors";

class SideMenu extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      menuIsOpen: false
    }
  }

  static propTypes = {
    auth: PropTypes.object.isRequired,
    setMenuOpen: PropTypes.func.isRequired,
    menuIsOpen: PropTypes.func.isRequired,
  };

  static getDerivedStateFromProps(props, state) {
     return { menuIsOpen: props.menuIsOpen };
  }

  render() {
    return (
      <Menu right isOpen={this.state.menuIsOpen} onStateChange={ (state) => this.props.setMenuOpen(state.isOpen) }>
        <FilterMenu/>
        <Button onClick={() => this.props.setMenuOpen(false)}>CLICK ME</Button>
      </Menu>
    );
  }
}


const mapStateToProps = createSelector(
  getAuth,
  getMenuIsOpen,
  (auth, menuIsOpen) => ({
    auth,
    menuIsOpen
  })
);


const mapDispatchToProps = Object.assign(userInterfaceActions);

  export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideMenu);

