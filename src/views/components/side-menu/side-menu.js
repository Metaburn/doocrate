import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import OffCanvas from 'react-aria-offcanvas';
import FilterMenu from "../filter-menu/filter-menu";
import {userInterfaceActions} from "../../../user-interface";
import {createSelector} from "reselect";
import {getAuth} from "../../../auth";
import {connect} from "react-redux";
import {getMenuIsOpen} from "../../../user-interface/selectors";
import { throttle } from 'lodash';
import './side-menu.css';

class SideMenu extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isMobile: this.isMobile(),
      isTablet: this.isTablet()
    };

    this.throttled = null;
  }

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

  render() {
    const { i18n, menuIsOpen, setMenuOpen } = this.props;
    const { isMobile } = this.state;

    const isHebrew = i18n.language === 'he';
    const position = isMobile ? 'bottom' : isHebrew ? 'right' : 'left';
    const classNames = classnames('filter-side-menu', { 'is-mobile': isMobile });

    return (
      <OffCanvas
        overlayClassName="filter-side-menu-overlay"
        className={classNames}
        position={position}
        height="100%"
        closeOnOverlayClick={true}
        isOpen={menuIsOpen}
        onClose={() => setMenuOpen(false)}>
        <FilterMenu/>
      </OffCanvas>
    );
  }
}

SideMenu.propTypes = {
  auth: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  menuIsOpen: PropTypes.bool.isRequired,
  setMenuOpen: PropTypes.func.isRequired
};

const mapStateToProps = createSelector(
  getAuth,
  getMenuIsOpen,
  (auth, menuIsOpen) => ({
    auth,
    menuIsOpen
  })
);

const mapDispatchToProps = Object.assign(userInterfaceActions);

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
