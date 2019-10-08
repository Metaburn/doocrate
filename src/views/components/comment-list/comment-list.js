import React, { Component }  from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import CommentItem from '../comment-item/comment-item';
import './comment-list.css';
import { I18n } from 'react-i18next';

class CommentList extends Component {
  static propTypes = {
    comments: PropTypes.instanceOf(List),
    task: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
  };

  render() {
    if(!this.props.comments) { return};
    let commentItems = this.props.comments.map((comment, index) => {
      return (
        <CommentItem
          key={index}
          commentNumber={index}
          comment={comment}
          updateComment={this.props.updateComment}
          removeComment={this.props.removeComment}
          auth={this.props.auth}
        />
      )
    });

    return (
      <div className='comment-list'>
        <I18n ns='translations'>
          {
            (t, { i18n }) => (
              <div>
                <div className={'comment-title'}>{t('comments.title')}</div>
                {commentItems}
              </div>
            )}
        </I18n>
      </div>
    );
  };
}

export default CommentList;
