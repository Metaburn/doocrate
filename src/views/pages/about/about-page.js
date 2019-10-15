import React from 'react';
import Button from 'src/views/components/button';

import './about-page.css';
import { I18n } from 'react-i18next';
import AboutCarousel from 'src/views/components/about-carousel';

const AboutPage = () => {
  return (
    <I18n ns='translations'>
      {
        (t, { i18n }) => (
        <div className="g-row about-page">
          <div className="g-col">

            <h1>{t('about.q1')}</h1>
            <div dangerouslySetInnerHTML={
              {__html: t('about.a1', {interpolation: {escapeValue: false}})}
            } />
            <br /><br />

            <h1>{t('about.q2')}</h1>
            <div dangerouslySetInnerHTML={
              {__html: t('about.a2', {interpolation: {escapeValue: false}})}
            } />
            <br /><br />

            <h1>{t('about.q3')}</h1>
            <div dangerouslySetInnerHTML={
              {__html: t('about.a3', {interpolation: {escapeValue: false}})}
            } />
            <br /><br />

            <h1>{t('about.q4')}</h1>
            <div dangerouslySetInnerHTML={
              {__html: t('about.a4', {interpolation: {escapeValue: false}})}
            } />
            <br /><br />

            <h1>{t('about.q5')}</h1>
            <div dangerouslySetInnerHTML={
              {__html: t('about.a5', {interpolation: {escapeValue: false}})}
            } />
            <br /><br />

            <h1>{t('about.q6')}</h1>
            <div dangerouslySetInnerHTML={
              {__html: t('about.a6', {interpolation: {escapeValue: false}})}
            } />
            <br /><br />

            <h1>{t('about.q7')}</h1>
            <div dangerouslySetInnerHTML={
              {__html: t('about.a7', {interpolation: {escapeValue: false}})}
            } />
            <br /><br />

            {t('about.faces')}
            <div className={'carousel-container'}>
              <AboutCarousel />
            </div>

            <Button className='button-small'><a href='/'>{t('about.return')}</a></Button>
          </div>
        </div>
        )}
    </I18n>
  );
};

AboutPage.propTypes = {
};

export default AboutPage;
