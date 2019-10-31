import React, { Component } from 'react';

import './google-translate.css';
import PropTypes from "prop-types";
import Button from "../button/button";
import Icon from "../../atoms/icon/icon";

// Calls google translate when a user clicks on english
// If shouldGoogleTranslateToEnglish is set then it auto translate to english
class GoogleTranslate extends Component {

  componentWillReceiveProps(nextProps) {
    this.updateStateByProps(nextProps);
  }

  updateStateByProps(props) {
    if(!props) return;
      if(props.shouldGoogleTranslateToEnglish) {
        this.clickOnEnglish();
      }else {
        // Should un-translate
        this.untranslate();
      }
  }

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
    if (!iframe || iframe.length <= 0) {
      return;
    }

    // Only if any language is set - unset it
    const selectedLanguage = document.getElementsByClassName('goog-te-menu-value');
    if (!selectedLanguage || selectedLanguage.length <= 0) {
      return;
    }

    if (selectedLanguage[0].text.indexOf('Select') !== -1) { //Means it is set on Select Language
      return;
    }

    // Some language is chosen - untranslate
    const closeButton = iframe[0].contentWindow.document.getElementsByClassName('goog-close-link');
    if (closeButton && closeButton.length > 0) {
      closeButton[0].click();
    }
  }

  // Simulate a click on the english translation
  // We simulate this when the user chooses english and the project is hebrew
  clickOnEnglish() {
    const languagesIFrame = document.getElementsByClassName('goog-te-menu-frame');
    if(languagesIFrame && languagesIFrame.length > 0) {
      const languages = languagesIFrame[0].contentWindow.document.getElementsByClassName('goog-te-menu2-item');

      // Find the english language
      const enLang = Array.prototype.filter.call(languages, (lang)=> {return lang.value === 'en'});

      if(enLang && enLang.length > 0) {
        enLang[0].click();
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

GoogleTranslate.propTypes = {
  shouldGoogleTranslateToEnglish: PropTypes.bool.isRequired
};

export default GoogleTranslate;
