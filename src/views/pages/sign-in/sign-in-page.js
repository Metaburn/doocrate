import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { authActions } from 'src/auth';
import { notificationActions } from 'src/notification';
import Button from 'src/views/components/button';
import { I18n } from 'react-i18next';
import { SignupLogin } from 'src/views/components/signup-login'
import { setCookie, getCookie } from 'src/utils/browser-utils';
import SignInCarousel from "../../components/sign-in-carousel/sign-in-carousel";

import i18n from "../../../i18n";
import GoogleSignIn from "../../components/google-sign-in/google-sign-in";
import FacebookSignIn from "../../components/facebook-sign-in/facebook-sign-in";


import logo from 'public/logo.png';
import './sign-in-page.css';

class SignInPage extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      showSignupLogin: false,
      email: '',
    };

    this.sendMagicLink = this.sendMagicLink.bind(this);
  }
  static propTypes = {
    signInWithFacebook: PropTypes.func.isRequired,
    signInWithGoogle: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.setProjectCookieOrRedirectIfExists();
  }

  // Save the project cookie for redirection - after the user sign in we know to redirect him there
  setProjectCookieOrRedirectIfExists() {
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

  showHideSignupLogin = () => {
    this.setState({ showSignupLogin: !this.state.showSignupLogin })
  };

  render() {

    return (
      <I18n ns='translations'>
        {
          (t, {i18n}) => (
            <div className="sign-in">
              <div className="sign-in-content-container">
                <div className={'sign-in-header'} >
                  <img className={'logo'} src={logo} alt={'Doocrate'}/>
                  <h1>
                    {t('welcome.doocrate')}
                  </h1>
                </div>
                <h2>
                  {t('welcome.heading')}
                </h2>
                <div className='sign-in-content'>
                  <h3>
                    {t('welcome.already-have')}
                  </h3>
                  <Button className={'button-as-link login-btn'}
                          onClick={this.showHideSignupLogin}>{t('welcome.login-here')}</Button>

                  <div className={'field-wrapper'}>
                    <label className="login-label">{t('welcome.email')}</label>
                    <form onSubmit={this.handleSubmit}>
                      {this.renderEmail()}
                      <input className="login-button"
                             type="submit"
                             value={t('welcome.signup-email')}/>
                    </form>
                  </div>

                  <div className='sign-in-buttons'>
                    <GoogleSignIn onClick={this.props.signInWithGoogle}/>
                    <FacebookSignIn onClick={this.props.signInWithFacebook}/>
                  </div>
                  <br/>
                  <br/>
                </div>
              </div>
              <div className="sign-in-image-container">
                <SignInCarousel />
              </div>
              {this.renderSignupLogin()}
            </div>
          )}
      </I18n>
    );
  }


  renderEmail() {
    return (<input
      type='email'
      className='login-field w-input'
      maxLength='256'

      name={'email'}
      ms-field='email'
      autoFocus={true}
      required
      value={this.state['email']}
      onChange={this.handleChange}
    />);
  }

  handleChange = (e) =>{
    let fieldName = e.target.name;
    this.setState({
      [fieldName]: e.target.value
    });
  };

  handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }

    this.props.signInWithEmailPassword(this.state.email);
    this.props.showSuccess(i18n.t('signin.check-your-email'));
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
