import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './take-ownership-modal.css';

import { I18n } from 'react-i18next';
import Modal from 'react-responsive-modal';
import Icon from "../../atoms/icon/icon";

export class TakeOwnershipModal extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      isOpen: false,
      email: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.updateStateByProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateStateByProps(nextProps);
  }

  updateStateByProps(props) {
    if (!props) {
      return;
    }

    this.setState({
      isOpen: props.isOpen || false,
    })
  }


  onOpenModal = () => {
    this.setState({ isOpen: true });
  };

  onCloseModal = () => {
    this.setState({ isOpen: false });
    this.props.onClosed();
  };

  render() {
    const { isOpen } = this.state;

    return (
      <I18n ns='translations'>
        {
          (t, { i18n }) => (
            <Modal open={isOpen} onClose={this.onCloseModal} center classNames={{
              modal: 'take-ownership-modal-container'}}>
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
        <Icon className='question' name='help_outline'/>
        {this.props.header ?
          <h1>{t(this.props.header)}</h1>
         : ''}
      </div>
    );
  }

  renderBody(t) {
    let text;
    if(this.props.textLines) {
      text = this.props.textLines.map((line, index) => {
          return (
            <div key={index}>
              <br/>
              <span>{t(line)}</span>
            </div>);
        }
      );
    }

    return (
      <div className='modal-body'>
        {text}
        <button onClick={() => {
          this.props.onYes();
          this.onCloseModal();
        }
        } className={`yes-btn yes-btn-dir-${t('lang-float')}`}>{t('task.yes')}</button>
        <button onClick={this.onCloseModal}>{t('task.no')}</button>
      </div>
    );
  }

  handleChange(e) {
    let fieldName = e.target.name;
    this.setState({
      [fieldName]: e.target.value
    });
  }

}

TakeOwnershipModal.propTypes = {
  onClosed: PropTypes.func.isRequired,
  onYes: PropTypes.func.isRequired,
  textLines: PropTypes.array,
  header: PropTypes.string
};


export default TakeOwnershipModal;
