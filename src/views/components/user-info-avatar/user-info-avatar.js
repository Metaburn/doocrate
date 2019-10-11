import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Img from 'react-image';
import { I18n } from 'react-i18next';

import UserInfoTooltip from '../user-info-tooltip/user-info-tooltip';

import './user-info-avatar.css';
import {createSelector} from "reselect";
import {getAuth} from "../../../auth";
import {connect} from "react-redux";

class UserInfoAvatar extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      user: null,
      showTooltip: false,
      isClicked: false
    }
  }

  render() {
    const { photoURL, alt} = this.props;
    const uniqueId = this.props.uniqueId || '';

    // React tooltip doesn't have any on click so we need to listen here and pass it to the component
    // We use data-iscapture so the event would propagate and we would be able to get the on click
    return (
      <I18n ns='translations'>
        {
          (t) => (
            <span className={'user-info-avatar'}
                  data-iscapture={true}
                  data-event="click"
                  data-tip=""
                  data-for={`user-info-tooltip-${uniqueId}`}
                  onClick={() => { this.setState({ isClicked: !this.state.isClicked })}}>
              <Img className='avatar' src={photoURL} alt={alt}/>
              <UserInfoTooltip
                uniqueId={this.props.uniqueId}
                userId={this.props.userId}
                showTooltip={this.state.showTooltip}
                isClicked={this.state.isClicked}
                />
            </span>
          )}
      </I18n>
    )
  }
}

UserInfoAvatar.propTypes = {
  // We use uniqueId in the case we have multiple tooltip (For example for comments or other components that are rendered using .mep
  uniqueId: PropTypes.string,
  photoURL: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

//=====================================
//  CONNECT
//-------------------------------------
const mapStateToProps = createSelector(
  getAuth,
  (auth) => ({
    auth,
  })
);


const mapDispatchToProps = Object.assign(
  {},
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserInfoAvatar);
