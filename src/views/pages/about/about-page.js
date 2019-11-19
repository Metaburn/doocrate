import React, { Component } from 'react';
import Button from 'src/views/components/button';
import { I18n } from 'react-i18next';
import AboutCarousel from 'src/views/components/about-carousel';
import { connect } from 'react-redux';
import { userInterfaceActions } from 'src/user-interface';

import './about-page.css';
import MeEmptyPlaceholder from '../../molecules/meEmptyPlaceholder/meEmptyPlaceholder';

export class AboutPage extends Component {
  render() {
    const { selectedProject, auth } = this.props;
    const projectUrl =
      selectedProject && selectedProject.url
        ? selectedProject.url
        : auth.defaultProject;

    return (
      <I18n ns="translations">
        {(t, { i18n }) => (
          <div className="g-row about-page">
            <div className="g-col">
              <MeEmptyPlaceholder
                projectUrl={projectUrl}
                setTour={this.startTour}
              />

              <br />
              <br />

              <h3>{t('about.q1')}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t('about.a1', {
                    interpolation: { escapeValue: false },
                  }),
                }}
              />
              <br />
              <br />

              <h3>{t('about.q_docs')}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t('about.a_docs', {
                    interpolation: { escapeValue: false },
                  }),
                }}
              />
              <br />
              <br />

              <h3>{t('about.q2')}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t('about.a2', {
                    interpolation: { escapeValue: false },
                  }),
                }}
              />
              <br />
              <br />

              <h3>{t('about.q3')}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t('about.a3', {
                    interpolation: { escapeValue: false },
                  }),
                }}
              />
              <br />
              <br />

              <h3>{t('about.q4')}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t('about.a4', {
                    interpolation: { escapeValue: false },
                  }),
                }}
              />
              <br />
              <br />

              <h3>{t('about.q5')}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t('about.a5', {
                    interpolation: { escapeValue: false },
                  }),
                }}
              />
              <br />
              <br />

              <h3>{t('about.q6')}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t('about.a6', {
                    interpolation: { escapeValue: false },
                  }),
                }}
              />
              <br />
              <br />

              <h3>{t('about.q7')}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t('about.a7', {
                    interpolation: { escapeValue: false },
                  }),
                }}
              />
              <br />
              <br />

              <h3>{t('about.q8')}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t('about.a8', {
                    interpolation: { escapeValue: false },
                  }),
                }}
              />
              <br />
              <br />

              <h3>{t('about.q9')}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t('about.a9', {
                    interpolation: { escapeValue: false },
                  }),
                }}
              />
              <br />
              <br />

              <h3>{t('about.q10')}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t('about.a10', {
                    interpolation: { escapeValue: false },
                  }),
                }}
              />
              <br />
              <br />

              <div className={'carousel-container'}>
                <AboutCarousel />
              </div>
              <br />
              <Button className="button-small">
                <a href="/">{t('about.return')}</a>
              </Button>
            </div>
          </div>
        )}
      </I18n>
    );
  }

  startTour = () => {
    const { selectedProject, auth } = this.props;
    const projectUrl =
      selectedProject && selectedProject.url
        ? selectedProject.url
        : auth.defaultProject;

    // Some bugs doesn't allow us to start the tour when navigating to another page
    // This prevent it
    setTimeout(() => {
      this.props.setTour(true, 0);
    }, 1000);

    this.props.history.push(`/${projectUrl}/task/1`);
  };
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    selectedProject: state.projects.selectedProject,
  };
};

const mapDispatchToProps = Object.assign(
  {},
  { setTour: userInterfaceActions.setTour },
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AboutPage);
