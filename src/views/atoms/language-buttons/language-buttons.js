import React from 'react';

import './language-buttons.css';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const LanguageButtons = ({ changeLanguage, i18n }) => {
  const enClassNames = classNames('notranslate button-as-link', {
    disabled: i18n.language === 'en',
  });
  const heClassNames = classNames('notranslate button-as-link', {
    disabled: i18n.language === 'he',
  });

  return (
    <div className={'language-buttons'}>
      <button
        className={enClassNames}
        onClick={() => {
          changeLanguage(i18n, 'en');
        }}
      >
        {i18n.t('nav.en-lang')}
      </button>
      |
      <button
        className={heClassNames}
        onClick={() => {
          changeLanguage(i18n, 'he');
        }}
      >
        {i18n.t('nav.he-lang')}
      </button>
    </div>
  );
};

LanguageButtons.propTypes = {
  changeLanguage: PropTypes.func.isRequired,
  i18n: PropTypes.object.isRequired,
};

export default LanguageButtons;
