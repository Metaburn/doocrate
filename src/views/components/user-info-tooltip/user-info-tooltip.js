import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import Img from 'react-image';
import { loadUser } from 'src/users/actions';
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

    this.state = {
      user: {},
      isLoading: true
    };
  }

  componentDidMount() {
    this.loadUserInfo();
  }

  loadUserInfo = () => {
    const { userId } = this.props;

    loadUser(userId)
      .then(snapshot => {
        if (snapshot.exists) {
          const user = snapshot.data();

          this.setState({
            user,
            isLoading: false
          });
        }
    });
  };

  editMyInfo = () => {
    this.props.history.push('/me');
  };

  render() {
    const uniqueId = this.props.uniqueId || '';
    const { user, isLoading } = this.state;

    if (isLoading) { return null; }

    const isSelfView = (this.props.auth && this.props.auth.id === this.props.userId);

    return (
      <ReactTooltip
        id={`user-info-tooltip-${uniqueId}`}
        place={'bottom'}
        type='light'
        data-html={true}
        effect='solid'>
        <div className={'user-info-tooltip-container'}>
          {isSelfView &&
            <span onClick={this.editMyInfo} className={`edit-icon edit-icon-${i18n.t('lang-float')}`}>
              <Icon name={'edit'} alt={i18n.t('general.click-to-edit')}/>
            </span>}

          {user &&
              <Fragment>
                {user.name}
                <Img className='tooltip-avatar' src={user.photoURL}/>
                <EditorPreview data={user.bio}/>
            </Fragment>}
        </div>
      </ReactTooltip>
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
