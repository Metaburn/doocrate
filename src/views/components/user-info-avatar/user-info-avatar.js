import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Img from 'react-image';
import { I18n } from 'react-i18next';
import UserInfoTooltip from '../user-info-tooltip/user-info-tooltip';
import {createSelector} from "reselect";
import {getAuth} from "../../../auth";
import {connect} from "react-redux";
import './user-info-avatar.css';

class UserInfoAvatar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { photoURL, alt} = this.props;
    const uniqueId = this.props.uniqueId || '';

    return (
      <I18n ns='translations'>
        {(t) => (
            <span className={'user-info-avatar'}
                  data-iscapture={true}
                  data-event="click"
                  data-tip=""
                  data-for={`user-info-tooltip-${uniqueId}`}>

              <Img className='avatar' src={photoURL} alt={alt}/>

              <UserInfoTooltip
                uniqueId={this.props.uniqueId}
                userId={this.props.userId}/>
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
