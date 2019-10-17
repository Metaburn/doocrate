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
import throttle from 'lodash.throttle';

class SideMenu extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      menuIsOpen: false,
      isMobile: this.isMobile()
    };

    this.throttled = null;
  }

  static propTypes = {
    auth: PropTypes.object.isRequired,
    setMenuOpen: PropTypes.func.isRequired,
    menuIsOpen: PropTypes.func.isRequired,
  };

  // We listen for window resize but making sure not every resize count to
  // not get too many updates and kill performances
  throttledHandleWindowResize = () => {
    if(!this.throttled) {
      // initialize the throttled function
      this.throttled = throttle(() => {
        this.setState({ isMobile: this.isMobile() });
      }, 200, {leading: true});

    }else {
      // call the throttled function
      this.throttled();
      return;
    }
  };

  isMobile = () => {
    return window.innerWidth < 767 ;
  };

  componentDidMount() {
    window.addEventListener('resize', this.throttledHandleWindowResize);

  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.throttledHandleWindowResize);
  }

  static getDerivedStateFromProps(props, state) {
     return { menuIsOpen: props.menuIsOpen };
  }

  handleChange = (state) => {
    this.props.setMenuOpen(state.isOpen);
  };

  render() {
    return (
      <Menu right isOpen={this.state.menuIsOpen}
            disableOverlayClick = {false}
            onStateChange={ (state) => this.handleChange(state) }
      width={ this.state.isMobile? '80%': '300px'}>
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
