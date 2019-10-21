import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Redirect } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import Button from '../button';
import Icon from '../icon';
import Img from 'react-image';
import { I18n } from 'react-i18next';

import './my-profile-tooltip.css';

class MyProfileTooltip extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      redirectTo: null
    };
  }

  redirectTo = (url) => {
    this.setState({
      redirectTo: url
    })
  };

  renderRedirectTo = () => {
    if (this.state.redirectTo) {
      this.setState({redirectTo: null}); //TODO - Probably should not render and set state
      return (
        <Switch>
          <Redirect to={this.state.redirectTo}/>
        </Switch>
      )
    }
  };

  render() {
    const { auth } = this.props;

    if(auth && auth.authenticated) {
      return (
        <I18n ns='translations'>
        {
         (t) => (
           <div className='my-profile-tooltip-container'
                data-tip="" data-for='my-profile'>

            <Icon name='keyboard_arrow_down'/>
            { auth.photoURL ?
              <Img
              className='avatar grow'
              src={ this.props.auth.photoURL } />
            :
              <span>{t('header.me')}</span>
            }

             <ReactTooltip id={'my-profile'}
                           place={'bottom'}
                           type='light'
                           data-html={true}
                           effect='solid'
                           delayHide={500}>

               <span className='tooltip-container'>
                 <Button onClick={() => this.redirectTo('/me')}>{t('header.my-space')}</Button>
                 <Button onClick={() => this.redirectTo('/projects?show=true')}>{t('header.all-projects')}</Button>
                 <Button className='button-no-border' onClick = { this.props.isShowUpdateProfile } >{t('header.update-my-profile')}</Button>
                 <Button onClick={() => this.redirectTo('/create-project')}>{t('header.create-project')}</Button>
                 <Button className='button-no-border' onClick = { this.props.signOut } >{t('header.disconnect')}</Button>
              </span>
             </ReactTooltip>
             { this.renderRedirectTo() }
          </div>
        )}
        </I18n>
      )
    }else {
      return (<span/>);
    }
  }
}

MyProfileTooltip.propTypes = {
  auth: PropTypes.object.isRequired,
  signOut: PropTypes.func.isRequired,
  projectUrl: PropTypes.string,
  isShowUpdateProfile: PropTypes.func.isRequired
};

export default MyProfileTooltip;
