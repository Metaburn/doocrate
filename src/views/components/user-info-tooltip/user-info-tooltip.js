import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import Popover from "react-simple-popover";
import Img from 'react-image';
import {createSelector} from "reselect";
import {getAuth} from "../../../auth";
import {connect} from "react-redux";
import { Link, withRouter } from "react-router-dom";
import EditorPreview from "../../atoms/editor-preview/editor-preview";
import Icon from "../icon/icon";
import i18n from 'src/i18n';
import './user-info-tooltip.css';

class UserInfoTooltip extends Component {

  render() {
    const uniqueId = this.props.uniqueId || '';
    const {auth, userId, isVisible, target, handleClose, user, projectUrl} = this.props;

    const isSelfView = (auth && auth.id === userId);

    const userComponent = (user? <span className="username">{user.name}</span>: '');

    return (
      <Popover show={isVisible}
               target={target.current}
               onHide={handleClose}
               placement="bottom"
               containerStyle={Object.assign({}, {"z-index":"10000"})}
               id={`user-info-tooltip-${uniqueId}`}>
        <div className="user-info-tooltip-container">
          {(isSelfView && <Link className={`edit-icon-container`} to={`/${projectUrl}/me`}>
            { userComponent }
            <Icon name='edit' alt={i18n.t('general.click-to-edit')}/>
          </Link>)}

          {(!isSelfView) && userComponent }

          {user &&
          <Fragment>
            <Img className='tooltip-avatar' src={user.photoURL}/>
            <EditorPreview data={user.bio}/>
          </Fragment>}
        </div>
      </Popover>
    );
  }
}

UserInfoTooltip.propTypes = {
  auth: PropTypes.object,
  isVisible: PropTypes.bool,
  target: PropTypes.object,
  user: PropTypes.object,
  uniqueId: PropTypes.string,
  userId: PropTypes.string.isRequired,
  handleClose: PropTypes.func,
  projectUrl: PropTypes.string,
};

const mapStateToProps = createSelector(getAuth, (auth) => ({ auth }));

export default withRouter(connect(mapStateToProps)(UserInfoTooltip));
