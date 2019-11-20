import React, { Component } from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import CommentItem from '../comment-item/comment-item';
import i18n from 'src/i18n';

import './comment-list.css';

class CommentList extends Component {
  static propTypes = {
    comments: PropTypes.instanceOf(List),
    task: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    projectUrl: PropTypes.string.isRequired,
  };

  render() {
    const { projectUrl, auth, comments } = this.props;
    if (!comments) {
      return;
    }
    let commentItems = comments.map((comment, index) => {
      return (
        <CommentItem
          key={index}
          commentNumber={index}
          comment={comment}
          updateComment={this.props.updateComment}
          removeComment={this.props.removeComment}
          auth={auth}
          projectUrl={projectUrl}
        />
      );
    });

    return (
      <div className="comment-list">
        <div>
          <div className={'comment-title'}>{i18n.t('comments.title')}</div>
          {commentItems}
        </div>
      </div>
    );
  }
}

export default CommentList;
