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
  constructor() {
    super(...arguments);

    this.state = {
      user: {
        name: 'Loading...',
        photoURL: null
      },
      //Since react tooltip doesn't have onClick - we need to receive it from the parent
      isClicked: false,
      isLoading: true
    }
  }

  componentDidMount() {
    this.loadUserInfo();
  }

  componentWillReceiveProps(nextProps) {
    // this.updateStateByProps(nextProps);
  }

  // NO NEED
  // updateStateByProps(props) {
  //   if (!props) { return; }

  //   this.setState({
  //     user: props.user,
  //   });

  //   // we alter the state to know on each click
  //   if (props.isClicked !== this.state.isClicked ) {
  //     const now = new Date();
  //     this.setState({
  //       isClicked: props.isClicked,
  //       lastClicked: now
  //     });
  //     this.loadUserInfo();
  //   }
  // }

  editMyInfo = () => {
    this.props.history.push('/me');
  };

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

  render() {
    const uniqueId = this.props.uniqueId || '';
    const { user, isLoading } = this.state;

    if (isLoading) { return null; }

    return(
      <ReactTooltip
        id={`user-info-tooltip-${uniqueId}`}
        place={'bottom'}
        type='light'
        data-html={true}
        effect='solid'>
      {
        <div className={'user-info-tooltip-container'}>
          {(this.props.auth && this.props.auth.id === this.props.userId) ?
            <span onClick={this.editMyInfo} className={`edit-icon edit-icon-${i18n.t('lang-float')}`}>
              <Icon name={'edit'} alt={i18n.t('general.click-to-edit')}/>
            </span>
            :
            ''
          }
          {user?
            <Fragment>
              {user.name}
              <Img className='tooltip-avatar' src={user.photoURL}/>
              <br/>
              <EditorPreview data={user.bio}/>
            </Fragment>
            :
            ''}
        </div>
      }
      </ReactTooltip>
    );
  }
}

UserInfoTooltip.propTypes = {
  uniqueId: PropTypes.string,
  showTooltip: PropTypes.bool,
  photoURL: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
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
