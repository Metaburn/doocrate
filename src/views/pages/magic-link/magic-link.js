import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { authActions } from 'src/auth';
import { notificationActions } from 'src/notification';
import { I18n } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import LoaderUnicorn from 'src/views/components/loader-unicorn/loader-unicorn';

class MagicLink extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      isShowRedirect: false,
      timer: null,
    };

    this.magicLogin = this.magicLogin.bind(this);
    this.startTimer = this.startTimer.bind(this);
  }

  componentWillMount() {
    this.magicLogin();
    this.startTimer();
  }

  magicLogin() {
    this.props.signInMagic();
  }

  // We want to show the redirect text after 3 seconds
  startTimer() {
    const timer = setInterval(() => {
      this.setState({
        isShowRedirect: true,
      });
      clearInterval(this.state.timer);
    }, 3000);
    this.setState({ timer });
  }

  render() {
    return (
      <I18n ns="translations">
        {(t, { i18n }) => (
          <div className="g-row sign-in">
            <LoaderUnicorn isShow={true} />
            <div className="g-col">
              <h1>
                {t('signin.redirecting')}
                <br />
                {this.state.isShowRedirect ? (
                  <NavLink to={{ pathname: '/' }}>
                    {t('signin.try-again')}
                  </NavLink>
                ) : (
                  ''
                )}
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

const mapDispatchToProps = Object.assign({}, authActions, notificationActions);

export default withRouter(connect(null, mapDispatchToProps)(MagicLink));
