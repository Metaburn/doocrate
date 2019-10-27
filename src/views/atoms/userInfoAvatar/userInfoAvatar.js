import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import Img from 'react-image';
import { I18n } from 'react-i18next';
import UserInfoTooltip from '../../components/user-info-tooltip/user-info-tooltip';
import {createSelector} from "reselect";
import { loadUser } from "src/users/actions";
import {getAuth} from "../../../auth/index";
import {connect} from "react-redux";
import './userInfoAvatar.css';

class UserInfoAvatar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false
    };

    this.targetElm = createRef();
  }

  toggleTooltip = (event) => {
    this.loadUserInfo();
    if(event) {
      event.preventDefault();
      return;
    }
  };

  handleClose = (e) => {
    this.setState({ isVisible: false });
  };

  loadUserInfo = () => {
    const { userId } = this.props;

    loadUser(userId)
      .then(snapshot => {
        if (!snapshot.exists) return;

        const user = snapshot.data();

        this.setState({
          user,
          isVisible: true
        });
    });
  };

  render() {
    const { userId, photoURL, alt } = this.props;
    const { isVisible, user } = this.state;
    const uniqueId = this.props.uniqueId || '';

    return (
      <I18n ns="translations">
        {(t) => (
            <span className="user-info-avatar"
              onClick={this.toggleTooltip}
              ref={this.targetElm}>

              <Img className="avatar" src={photoURL} alt={alt}/>

              <UserInfoTooltip user={user}
                target={this.targetElm}
                isVisible={isVisible}
                handleClose={this.handleClose}
                uniqueId={uniqueId}
                userId={userId}/>
            </span>
          )}
      </I18n>
    );
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
