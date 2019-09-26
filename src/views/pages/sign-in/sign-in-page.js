import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { authActions } from 'src/auth';
import { notificationActions } from 'src/notification';
import Button from 'src/views/components/button';
import Icon from 'src/views/components/icon';
import { NavLink } from 'react-router-dom';
import { I18n } from 'react-i18next';
import { SignupLogin } from 'src/views/components/signup-login'
import { setCookie, getCookie } from 'src/utils/browser-utils';

import './sign-in-page.css';
import i18n from "../../../i18n";

class SignInPage extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      showSignupLogin: false,
    };

    this.showHideSignupLogin = this.showHideSignupLogin.bind(this);
    this.sendMagicLink = this.sendMagicLink.bind(this);
  }
  static propTypes = {
    signInWithFacebook: PropTypes.func.isRequired,
    signInWithGoogle: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.setProjectCookie();
  }

  // Save the project cookie for redirection - after the user sign in we know to redirect him there
  setProjectCookie() {
    const query = new URLSearchParams(this.props.location.search);
    const project = query.get('project');
    if(project) {
      setCookie('project', project);
    }else {
      // We might already have the cookie set in the past
      const project = getCookie('project');
      if(project) {
        this.props.history.push({
          search: '?project=' + project
        })
      }
    }
  }

  sendMagicLink(email) {
    this.props.signInWithEmailPassword(email);
    this.props.showSuccess(i18n.t('signin.check-your-email'));
  }

  renderSignupLogin() {
    return (
      <div>
        <SignupLogin
          isOpen = { this.state.showSignupLogin}
          sendMagicLink={ this.sendMagicLink }
          onClosed = { () => {
            this.setState({showSignupLogin: false});
            this.setState({showSignupLogin: false})
          }
          } />
      </div>
    );
  }

  showHideSignupLogin() {
    this.setState({ showSignupLogin: !this.state.showSignupLogin })
  }

  render() {
    return (
      <I18n ns='translations'>
        {
          (t, {i18n}) => (
            <div className="g-row sign-in">
              <div className="g-col">
                <h1 className="sign-in__heading">
                  {t('welcome.heading')}
                </h1>
                <h3 className="sign-in__heading">
                  {t('welcome.heading2')}
                </h3>
                <div className='sign-in__content'>
                  <h3 className='before-about'>
                    {t('welcome.registration')}
                  </h3>
                  <h5 className='about-header'>
                    (<NavLink to='/about'> {t('welcome.about')} ></NavLink>)
                  </h5>
                  <br/>
                  <h3>
                    {t('welcome.before-start')}
                  </h3>
                  <h3>
                    <Icon name='done' className='grow done'/>
                    {t('welcome.instruction1')}
                  </h3>
                  <h3>
                    <Icon name='done' className='grow done'/>
                    {t('welcome.instruction2')}
                  </h3>
                  <h3>
                    <Icon name='done' className='grow done'/>
                    {t('welcome.instruction3')}
                  </h3>
                  <h3>
                    <Icon name='done' className='grow done'/>
                    {t('welcome.instruction4')}
                  </h3>
                  <h3>
                    <Icon name='done' className='grow done'/>
                    {t('welcome.instruction5')}
                  </h3>
                  <h3>
                    {t('welcome.instruction6')}
                  </h3>
                  <div className='sign-in-buttons'>
                    <Button className="sign-in__button"
                            onClick={this.props.signInWithGoogle}>{t('welcome.google-login')}</Button>
                    <Button className="sign-in__button"
                            onClick={this.props.signInWithFacebook}>{t('welcome.facebook-login')}</Button>
                    <br />
                    <hr />
                    <br/>
                    <Button className="sign-in__button"
                            onClick={() => { this.showHideSignupLogin() }}>{t('welcome.signup-email')}</Button>
                    <Button className="sign-in__button"
                            onClick={() =>  {this.showHideSignupLogin() }}>{t('welcome.signin-email')}</Button>
                  </div>
                  <br/>
                  <br/>
                </div>
              </div>
              {this.renderSignupLogin()}
            </div>
          )}
      </I18n>
    );
  }
}

SignInPage.propTypes = {
  signInWithFacebook: PropTypes.func.isRequired,
  signInWithGoogle: PropTypes.func.isRequired,
  signInWithEmailPassword: PropTypes.func.isRequired,
  showSuccess: PropTypes.func.isRequired
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
  )(SignInPage)
);
