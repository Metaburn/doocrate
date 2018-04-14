import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './comment-item.css';
import Img from 'react-image';
import Moment from 'react-moment';
import 'moment/locale/he';
import 'moment-timezone';
import Linkify from 'react-linkify';
import { I18n } from 'react-i18next';

export class CommentItem extends Component {
  constructor() {
    super(...arguments);
    this.state = {};
  }

  render() {
    const { comment } = this.props;

    return (
      <I18n ns='translations'>
        {
          (t, { i18n }) => (
          <div className='comment-item'>
            {this.renderHeader(t, comment)}
            {this.renderBody(comment)}
          </div>
          )
        }
      </I18n>
    );
  }

  renderHeader(t, comment) {
    if (!comment.creator) return;
    const { creator } = comment;
    const avatar = creator.photoURL ? <Img className='avatar' src={creator.photoURL} alt={comment.creator.name}/> : '';
    return (
      <div className='comment-item-creator'>
        <span>{ avatar } { creator.name } <Moment locale={t('lang')} fromNow>{comment.created}</Moment></span>
      </div>
    );
  }

  renderBody(comment) {
    return (
      <div className='comment-body'>
        <Linkify>
          {comment.body}
        </Linkify>
      </div>
    );
  }

}

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
};


export default CommentItem;
