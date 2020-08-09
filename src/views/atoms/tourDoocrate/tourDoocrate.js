import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tour from 'reactour';
import Emoji from '../emoji/emoji';
import i18n from 'src/i18n';

import './tourDoocrate.css';

/*
  A Walk-through / tour component for the app
  Coupled through css data selectors
 */
class TourDoocrate extends Component {
  constructor(props) {
    super(props);

    this.steps = [
      {
        content: i18n.t('tour.welcome'),
      },
      {
        selector: '[data-tour="one"]',
        content: () => (
          <div>
            <p>
              {i18n.t('tour.create-task')}
              <Emoji symbol="🐳" />
              <Emoji symbol="🎋" />
              <Emoji symbol="👉🏼" />
            </p>
          </div>
        ),
      },
      {
        selector: '[data-tour="two"]',
        content: () => (
          <div>
            <p>
              {i18n.t('tour.search-humans')}{' '}
              <span role={'img'}>
                <Emoji symbol="🧞‍🧜‍🧚‍🧙" />‍
              </span>
            </p>
          </div>
        ),
      },
      {
        selector: '[data-tour="three"]',
        content: () => (
          <div>
            <p>{i18n.t('tour.filter')}</p>
          </div>
        ),
        position: 'top',
      },
      {
        selector: '[data-tour="four"]',
        content: () => (
          <div>
            <p>{i18n.t('tour.personal-space')}</p>
            <p>{i18n.t('tour.click-it')}</p>
          </div>
        ),
      },
      {
        selector: '[data-tour="five"]',
        content: () => (
          <div>
            <p>
              {i18n.t('tour.final')}
              <Emoji symbol="🙌👩🏼‍🎤 👨🏼‍🎤" />
            </p>
          </div>
        ),
      },
    ];
  }

  renderNextButton = text => {
    return <span className={`tour-button next-${i18n.language}`}>{text}</span>;
  };

  renderPrevButton = text => {
    return <span className={`tour-button back-${i18n.language}`}>{text}</span>;
  };

  renderLastStepNextButton = text => {
    return <span className={`tour-button next-${i18n.language}`}>{text}</span>;
  };

  render() {
    const { tour } = this.props;
    return (
      <Tour
        steps={this.steps}
        isOpen={tour.isShow}
        className={`tour-doocrate-helper lang-${i18n.language}`}
        onRequestClose={this.props.onCloseTour}
        badgeContent={(curr, tot) =>
          i18n.t('tour.of', { start: curr, end: tot })
        }
        prevButton={this.renderPrevButton(i18n.t('tour.prev'))}
        disableDotsNavigation={true}
        nextButton={this.renderNextButton(i18n.t('tour.next'))}
        lastStepNextButton={this.renderLastStepNextButton(
          i18n.t('tour.last-step-btn'),
        )}
        rounded={8}
      />
    );
  }
}

TourDoocrate.propTypes = {
  tour: PropTypes.object,
  onCloseTour: PropTypes.func.isRequired,
};

export default TourDoocrate;
