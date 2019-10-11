import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import Popover from "react-simple-popover";
import Img from 'react-image';
// import { loadUser } from 'src/users/actions';
import {createSelector} from "reselect";
import {getAuth} from "../../../auth";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import EditorPreview from "../editor-preview/editor-preview";
import Icon from "../icon/icon";
import i18n from '../../../i18n.js';
import './user-info-tooltip.css';

class UserInfoTooltip extends Component {
  constructor(props) {
    super(props);
  }

  editMyInfo = () => {
    this.props.history.push('/me');
  };

  render() {
    const uniqueId = this.props.uniqueId || '';
    const { isVisible, target, handleClose, user } = this.props;

    const isSelfView = (this.props.auth && this.props.auth.id === this.props.userId);

    return (
      <Popover show={isVisible}
        target={target.current}
        onHide={handleClose}
        placement="bottom"
        id={`user-info-tooltip-${uniqueId}`}>
        <div className="user-info-tooltip-container">
          {isSelfView &&
            <span onClick={this.editMyInfo} className={`edit-icon edit-icon-${i18n.t('lang-float')}`}>
              <Icon name={'edit'} alt={i18n.t('general.click-to-edit')}/>
            </span>}

          {user &&
              <Fragment>
                <span className="username">{user.name}</span>
                <Img className='tooltip-avatar' src={user.photoURL}/>
                <EditorPreview data={user.bio}/>
            </Fragment>}
        </div>
      </Popover>
    );
  }
}

UserInfoTooltip.propTypes = {
  uniqueId: PropTypes.string,
  userId: PropTypes.string.isRequired
};

const mapStateToProps = createSelector(
  getAuth,
  (auth) => ({
    auth,
  })
);

const mapDispatchToProps = Object.assign(
  {},
);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserInfoTooltip)
);
