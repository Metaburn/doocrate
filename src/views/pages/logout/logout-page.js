import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { authActions } from 'src/auth';
import { I18n } from 'react-i18next';

import './logout-page.css';

class LogoutPage extends Component {
  componentWillMount() {
    this.props.signOut();
  }

  render() {
    return (
      <I18n ns="translations">
        {(t, { i18n }) => <div className="logout">Logging out...</div>}
      </I18n>
    );
  }
}

LogoutPage.propTypes = {
  signOut: PropTypes.func.isRequired,
};

const mapDispatchToProps = Object.assign({}, authActions);
export default withRouter(connect(null, mapDispatchToProps)(LogoutPage));
