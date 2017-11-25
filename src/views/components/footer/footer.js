import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button';
import { I18n } from 'react-i18next';

import './footer.css';


const Footer = ({authenticated, signOut}) => (
  <footer className='footer'>
    <I18n ns='translations'>
        {
        (t, { i18n }) => (
          <div>
            {t('footer.about')}
            <a href='https://github.com/metaburn/doocrate'>&nbsp;{t('footer.opensource')}</a>
            &nbsp;{t('footer.server-with-love')}
            <a href='/about'>&nbsp;{t('footer.people')}</a>
          </div>
      )}
    </I18n>
  </footer>
);

Footer.propTypes = {
  
};


export default Footer;
