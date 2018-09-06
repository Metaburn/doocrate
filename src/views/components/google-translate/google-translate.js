import React, { Component } from 'react';

import './google-translate.css';

class GoogleTranslate extends Component {
  googleTranslateElementInit () {
    /* eslint-disable no-new */
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

  render() {
    return (
      <div id="google_translate_element"></div>
    );
  }
}

export default GoogleTranslate;
