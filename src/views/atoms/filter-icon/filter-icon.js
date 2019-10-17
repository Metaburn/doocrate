import React from 'react';
import PropTypes from "prop-types";
import { I18n } from 'react-i18next';

import './filter-icons.css';

const FilterIcon = ({isActive, onClick}) => {
  const isActiveClass = isActive ? 'active': '';

  return (
    <I18n ns='translations'>
      {
        (t, { i18n }) => (
          <button className={`filter-icon-wrapper`} onClick={onClick}>
            <span className={`filter-icon ${isActiveClass}`} tabIndex={0} />
            <span className={`filter-text ${isActiveClass}`}>{t('filter.filter')}</span>
          </button>
        )}
    </I18n>
  );
};

FilterIcon.propTypes = {
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
};

export default FilterIcon;
