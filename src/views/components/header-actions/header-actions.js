import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-i18next';
import Button from '../button';

import './header-actions.css';
import MyProfileTooltip from '../my-profile-tooltip/my-profile-tooltip';

const menuContent = `<div>
    <Img className='avatar' src={auth.photoURL} alt={auth.name}/>
     <Button onClick={signOut}>{t('header.disconnect')}</Button>
  </div>`;

class HeaderActions extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      redirectTo: null,
    };
  }

  render() {
    const { auth } = this.props;
    if (auth && auth.authenticated) {
      return (
        <I18n ns="translations">
          {t => (
            <div className="header-actions">
              <MyProfileTooltip
                auth={this.props.auth}
                signOut={this.props.signOut}
                projectUrl={this.props.projectUrl}
                isShowUpdateProfile={this.props.isShowUpdateProfile}
              />
              {this.props.auth.photoURL ? (
                <div
                  className="task-item-assignee"
                  data-html
                  data-tip={menuContent}
                />
              ) : (
                <div
                  data-html
                  data-tip={
                    <div>
                      {t('header.me')}
                      <Button onClick={this.props.signOut}>
                        {t('header.disconnect')}
                      </Button>
                    </div>
                  }
                />
              )}
            </div>
          )}
        </I18n>
      );
    }
    return <span />;
  }
}

HeaderActions.propTypes = {
  auth: PropTypes.object.isRequired,
  signOut: PropTypes.func.isRequired,
  projectUrl: PropTypes.string,
  isShowUpdateProfile: PropTypes.func.isRequired,
};

export default HeaderActions;
