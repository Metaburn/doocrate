import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import ToolTip from 'react-portal-tooltip';
import Button from '../button';
import Img from 'react-image';

import './my-profile-tooltip.css';

class MyProfileTooltip extends Component {
  constructor() {
    super(...arguments);
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
  }

  state = {
    isTooltipActive: false
  }

  showTooltip() {
    this.setState({isTooltipActive: true})
  }

  hideTooltip() {
    this.setState({isTooltipActive: false})
  }

  render() {
    const { auth } = this.props;
    if(auth && auth.authenticated) {
      return (
        <div className='my-profile-tooltip-container'
        onMouseEnter={this.showTooltip}
        onMouseLeave={this.hideTooltip}>
          { auth.photoURL ? 
            <Img 
            className='avatar grow'
            src={ this.props.auth.photoURL } />
          :
            <span>אני</span>
          }
          
          <ToolTip active={this.state.isTooltipActive} position='bottom' arrow='left' parent='.my-profile-tooltip-container'>
            <span className='tooltip-container'>
              <NavLink to={{ pathname: '/', search: 'filter=mine'}}>המשימות שלי</NavLink><br/>
              <NavLink to='/me'>האזור האישי שלי</NavLink><br/>
              <Button className='button-no-border' onClick = { this.props.signOut } >התנתקי</Button>
            </span>
          </ToolTip>
        </div>
      )
    }else {
      return (<span/>);
    }
  }
}

MyProfileTooltip.propTypes = {
  auth: PropTypes.object.isRequired,
  signOut: PropTypes.func.isRequired
};

export default MyProfileTooltip;