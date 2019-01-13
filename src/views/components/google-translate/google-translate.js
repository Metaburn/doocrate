import React, { Component } from 'react';

import './google-translate.css';
import Button from '../button';
import Icon from '../icon';

class GoogleTranslate extends Component {
  googleTranslateElementInit () {
    /* eslint-disable no-new */
    // iw = hebrew
    new window.google.translate.TranslateElement({
      pageLanguage: 'iw',
      layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element')
  }

  componentDidMount() {
    let addScript = document.createElement('script');
    addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = this.googleTranslateElementInit;
  }

  // Simulate a click on the close button to close translations
  untranslate() {
    const iframe = document.getElementsByClassName('goog-te-banner-frame');
    if(iframe && iframe.length > 0) {
      const closeButton = iframe[0].contentWindow.document.getElementsByClassName('goog-close-link');
      if(closeButton && closeButton.length > 0) {
        closeButton[0].click();
      }
    }
  }

  render() {
    return (
      <div className={'google-translate-container notranslate'}>
        <div id='google_translate_element' />
        <Button className='button-no-border close-button' onClick={ () => this.untranslate() }>
          <Icon name='close' className='close-icon grow' />
        </Button>
      </div>
    );
  }
}

export default GoogleTranslate;
