import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { slide as Menu } from 'react-burger-menu'
import { I18n } from 'react-i18next';

import './side-menu.css';
import FilterMenu from "../filter-menu/filter-menu";
import {userInterfaceActions} from "../../../user-interface";
import {createSelector} from "reselect";
import {getAuth} from "../../../auth";
import {connect} from "react-redux";
import {getMenuIsOpen} from "../../../user-interface/selectors";
import { throttle } from 'lodash';

class SideMenu extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      isMobile: this.isMobile(),
      isTablet: this.isTablet()
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
        this.setState({
          isMobile: this.isMobile(),
        isTablet: this.isTablet()});
      }, 200, {leading: true});

    }else {
      // call the throttled function
      this.throttled();
    }
  };

  isMobile = () => {
    return window.innerWidth < 480 ;
  };

  isTablet = () => {
    return window.innerWidth < 768  &&
      window.innerWidth > 480;
  };

  componentDidMount() {
    window.addEventListener('resize', this.throttledHandleWindowResize);

  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.throttledHandleWindowResize);
  }

  handleChange = (state) => {
    this.props.setMenuOpen(state.isOpen);
  };

  render() {
    const width = this.state.isMobile? '80%':
      this.state.isTablet ? '50%' :
      '300px';

    return (
      <I18n ns='translations'>
        {
          (t, { i18n }) => (
            <Menu right={i18n.language !== 'he'}
                  isOpen={this.props.menuIsOpen}
                  className={`side-menu ${i18n.language === 'he' ? 'right-menu' : 'left-menu'}`}
                  disableOverlayClick={false}
                  onStateChange={(state) => this.handleChange(state)}
                  width={ width }>
              <FilterMenu/>
            </Menu>
          )
        }
      </I18n>
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
