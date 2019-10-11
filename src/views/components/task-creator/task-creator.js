import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserInfoAvatar from "../user-info-avatar/user-info-avatar";

import './task-creator.css';
import { I18n } from 'react-i18next';

class TaskCreator extends Component {

  render() {
    if (!this.props.creator) return (<span/>);
    const creator = this.props.creator;
    return (
      <I18n ns='translations'>
        {
          (t) => (
            <div className='task-creator'>
              <span>{t('task.creator')}</span>
              { creator && <UserInfoAvatar
                uniqueId={'task-creator'}
                photoURL={creator.photoURL}
                userId={creator.id}
                alt={creator.name}/>
              }
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
