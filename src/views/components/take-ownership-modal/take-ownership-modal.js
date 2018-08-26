import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './take-ownership-modal.css';
import Img from 'react-image';
import { I18n } from 'react-i18next';
import Modal from 'react-responsive-modal';

export class TakeOwnershipModal extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      isOpen: true,
      email: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onOpenModal = () => {
    this.setState({ isOpen: true });
  };

  onCloseModal = () => {
    this.setState({ isOpen: false });
    this.props.onClosed();
  };

  componentWillMount() {
    this.updateStateByProps(this.props);
  }

  render() {
    const { isOpen} = this.state;

    return (
      <I18n ns='translations'>
        {
          (t, { i18n }) => (
            <Modal open={isOpen} onClose={this.onCloseModal} center>
              <div className='take-ownership-modal' dir={t('lang-dir')}>
                <div className='modal-content'>
                  {this.renderHeader(t)}
                  {this.renderBody(t)}
                </div>
              </div>
            </Modal>
          )
        }
      </I18n>
    );
  }

  renderHeader(t) {
    return (
      <div className='modal-header'>
        <span>האם תרצי לקחת אחריות על משימה זו?</span>
        <span>במידה ולא, היא תשאר פתוחה עד שמישהי אחרת תקח עליה אחריות</span>
      </div>
    );
  }

  renderBody(t) {
    return (
      <div className='modal-body'>
        <button onClick={onYes}>כן</button>
        <button onClick={onCloseModal}>לא</button>
      </div>
    );
  }

  renderSubmit(t) {
    return (
      <div className={'submit-wrapper'}>
        <input className={`button button-small` }
               type="submit" value={t('user.submit')}/>
      </div>
    );
  }

  handleChange(e) {
    let fieldName = e.target.name;
    this.setState({
      [fieldName]: e.target.value
    });
  }

  handleSubmit(event) {
    if(event) {
      event.preventDefault();
    }
    const fieldsToUpdate = {
      email: this.state.email,
    };

    if(this.state.email)

    this.onCloseModal();
  }

}

TakeOwnershipModal.propTypes = {
  onClosed: PropTypes.func.isRequired
  onYes: PropTypes.func.isRequired
};


export default TakeOwnershipModal;
