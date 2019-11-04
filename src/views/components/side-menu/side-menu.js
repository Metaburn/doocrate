import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { slide as Menu } from 'react-burger-menu'
import FilterMenu from "../filter-menu/filter-menu";
import {userInterfaceActions} from "../../../user-interface";
import {createSelector} from "reselect";
import {getAuth} from "../../../auth";
import {connect} from "react-redux";
import {getMenuIsOpen} from "../../../user-interface/selectors";
import { isMobile, isTablet } from '../../../utils/browser-utils';
import i18n from "src/i18n";

import './side-menu.css';

class SideMenu extends Component {
  render() {
    const { menuIsOpen, setMenuOpen } = this.props;
    const width = isMobile? '98%' :
      isTablet? '70%':
        '370px';

    const isHebrew = i18n.language === 'he';
    const classNames = classnames('filter-side-menu',
      { 'is-mobile': isMobile,
        'right-menu': !isHebrew,
        'left-menu': isHebrew});

    return (
      <Menu right={isHebrew}
            isOpen={menuIsOpen}
            className={classNames}
            disableOverlayClick={false}
            onStateChange={(state) => setMenuOpen(state.isOpen)}
            width={ width }>
        <FilterMenu/>
      </Menu>
    );
  }
}

SideMenu.propTypes = {
  auth: PropTypes.object.isRequired,
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
