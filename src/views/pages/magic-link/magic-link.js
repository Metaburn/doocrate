import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { authActions } from 'src/auth';
import { notificationActions } from 'src/notification';
import { I18n } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import i18n from "../../../i18n";

class MagicLink extends Component {
  constructor() {
    super(...arguments);

    this.magicLogin = this.magicLogin.bind(this);
  }

  componentWillMount() {
    this.magicLogin();
  }

  magicLogin() {
    this.props.signInMagic();
  }

  render() {
    return (
      <I18n ns='translations'>
        {
          (t, {i18n}) => (
            <div className="g-row sign-in">
              <div className="g-col">
                <h1>
                  {t('signin.redirecting')}
                  <br/>
                  <NavLink to={{ pathname: '/'}} >{t('signin.try-again')}</NavLink>
                </h1>
              </div>
            </div>
          )}
      </I18n>
    );
  }
}

MagicLink.propTypes = {
  signInMagic: PropTypes.func.isRequired,
};


//=====================================
//  CONNECTREAD
//-------------------------------------

const mapDispatchToProps = Object.assign(
  {},
  authActions,
  notificationActions
);

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(MagicLink)
);
