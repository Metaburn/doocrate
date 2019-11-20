import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../atoms/icon/icon';
import { NavLink } from 'react-router-dom';
import i18n from 'src/i18n';

import './meEmptyPlaceholder.css';

const ItemRow = ({ iconName, onClick, toUrl, textButton, textDescription }) => {
  return (
    <div className={'items-row'}>
      <Icon name={iconName} />
      &nbsp;
      <button className={`button-as-link`} onClick={onClick}>
        {toUrl ? (
          <NavLink to={toUrl}>{textButton}</NavLink>
        ) : (
          <span>{textButton}</span>
        )}
      </button>
      <span>&nbsp;-&nbsp;{textDescription}</span>
    </div>
  );
};

class MeEmptyPlaceholder extends Component {
  render() {
    const { projectUrl } = this.props;

    return (
      <div className={'me-empty-placeholder'}>
        <h3>{i18n.t('me-empty.title')}</h3>

        {
          <Fragment>
            <ItemRow
              iconName={'play_circle_outline'}
              onClick={this.props.setTour}
              textButton={i18n.t('me-empty.start-tour')}
              textDescription={i18n.t('me-empty.start-tour-desc')}
            />
            <ItemRow
              toUrl={`/${projectUrl}/task/new-task`}
              iconName={'assignment'}
              textButton={i18n.t('me-empty.create-task')}
              textDescription={i18n.t('me-empty.create-task-desc')}
            />
            <ItemRow
              toUrl={`/${projectUrl}/task/1?filter=unassigned`}
              iconName={'assignment_ind'}
              textButton={i18n.t('me-empty.search-free-task')}
              textDescription={i18n.t('me-empty.search-free-task-desc')}
            />
            <ItemRow
              toUrl={`/${projectUrl}/task/1`}
              iconName={'face'}
              textButton={i18n.t('me-empty.search-humans')}
              textDescription={i18n.t('me-empty.search-humans-desc')}
            />
            <ItemRow
              toUrl={`/${projectUrl}/task/1`}
              iconName={'label'}
              textButton={i18n.t('me-empty.filter-by-tags')}
              textDescription={i18n.t('me-empty.filter-by-tags-desc')}
            />
          </Fragment>
        }
      </div>
    );
  }
}

MeEmptyPlaceholder.propTypes = {
  projectUrl: PropTypes.string,
  setTour: PropTypes.func,
};

export default MeEmptyPlaceholder;
