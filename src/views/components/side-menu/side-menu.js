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
import { isMobile, isTablet } from '../../../utils/browser-utils';
import './side-menu.css';

class SideMenu extends Component {
  render() {
    const { i18n, menuIsOpen, setMenuOpen } = this.props;
    const width = isMobile? '90%' :
      isTablet? '70%':
        '370px';

    const isHebrew = i18n.language === 'he';
    const position = isMobile ? 'bottom' : isHebrew ? 'right' : 'left';
    const classNames = classnames('filter-side-menu', { 'is-mobile': isMobile });

    return (
      <OffCanvas
        overlayClassName="filter-side-menu-overlay"
        className={classNames}
        height="100%"
        width={width}
        position={position}
        isOpen={menuIsOpen}
        onClose={() => setMenuOpen(false)}
        closeOnOverlayClick={true}>
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
