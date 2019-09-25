import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './take-ownership-modal.css';

import { I18n } from 'react-i18next';
import Modal from 'react-responsive-modal';

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

    const text = this.props.textLines.map((line) => {
        return (
          <div>
            <span><br/></span>
            <span>{t(line)}</span>
          </div>);
      }
    );

    return (
      <div className='modal-header'>
        {text}
      </div>
    );
  }

  renderBody(t) {
    return (
      <div className='modal-body'>
        <button onClick={() => {
          this.props.onYes();
          this.onCloseModal();
        }
        } className={'yes-btn'}>{t('task.yes')}</button>
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
  textLines: PropTypes.array.isRequired
};


export default TakeOwnershipModal;
