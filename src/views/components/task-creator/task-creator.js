import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Img from 'react-image';
import ReactTooltip from 'react-tooltip'

import './task-creator.css';
import { I18n } from 'react-i18next';

class TaskCreator extends Component {

  render() {
    if (!this.props.creator) return (<span/>);
    const creator = this.props.creator;
    const avatar = creator.photoURL ? <Img className='avatar' src={creator.photoURL} alt={creator.name}/> : '';
    return (
      <I18n ns='translations'>
        {
          (t) => (
            <div className='task-creator'>
              <span>{t('task.creator')}</span>
              <span className='avatar-creator' data-tip={creator.name}>
                <ReactTooltip type='light' effect='solid'/>
                {avatar}
                </span>
            </div>
          )}
      </I18n>
    );
  }
}

TaskCreator.propTypes = {
  creator: PropTypes.object,
};

export default TaskCreator;
